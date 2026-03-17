import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import Map "mo:core/Map";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import List "mo:core/List";
import Principal "mo:core/Principal";

actor {
  include MixinStorage();

  // Types
  type UserId = Text;
  type PassageId = Nat;
  type QuestionId = Nat;
  type ResultId = Nat;
  type ExternalBlobId = Text;

  type UserRole = {
    #admin;
    #teacher;
    #student;
  };

  type User = {
    id : UserId;
    username : Text;
    password : Text;
    role : UserRole;
    grade : ?Nat;
    teacherId : ?UserId;
  };

  type Passage = {
    id : PassageId;
    title : Text;
    content : Text;
    gradeLevel : Nat;
  };

  type Question = {
    id : QuestionId;
    passageId : PassageId;
    questionText : Text;
    options : [Text];
    correctIndex : Nat;
  };

  type TestResult = {
    id : ResultId;
    studentId : UserId;
    passageId : PassageId;
    answers : [Nat];
    score : Nat;
    timestamp : Int;
    audioBlobId : ?ExternalBlobId;
  };

  public type UserProfile = {
    userId : UserId;
    username : Text;
    role : UserRole;
    grade : ?Nat;
  };

  // Data structures
  let users = Map.empty<UserId, User>();
  let passages = Map.empty<PassageId, Passage>();
  let questions = Map.empty<PassageId, List.List<Question>>();
  let results = Map.empty<ResultId, TestResult>();
  let sessionMap = Map.empty<Principal, UserId>();
  var nextPassageId = 1;
  var nextQuestionId = 1;
  var nextResultId = 1;

  // Authorization module
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  let baseBlobPath = "/audio-responses/";

  // ============================================================
  // SYNCHRONOUS INITIALIZATION — runs immediately when actor starts
  // Admin accounts and sample content are seeded here so they are
  // available before any frontend call arrives.
  // ============================================================
  do {
    // Seed the single default admin account
    users.add("admin1", {
      id = "admin1";
      username = "Classio1";
      password = "Classio@11";
      role = #admin;
      grade = null;
      teacherId = null;
    });

    // Seed reading passages
    passages.add(1, {
      id = 1;
      title = "The Hungry Caterpillar";
      content = "Once upon a time there was a very hungry caterpillar. He ate leaves all day.";
      gradeLevel = 1;
    });
    passages.add(2, {
      id = 2;
      title = "The Solar System";
      content = "The solar system consists of the sun, planets, asteroids, and comets.";
      gradeLevel = 5;
    });
    passages.add(3, {
      id = 3;
      title = "Photosynthesis";
      content = "Photosynthesis is the process by which plants convert sunlight into energy.";
      gradeLevel = 9;
    });
    nextPassageId := 4;

    // Questions for passage 1
    questions.add(1, List.fromArray<Question>([
      { id = 1; passageId = 1; questionText = "What did the caterpillar eat?"; options = ["Leaves", "Meat", "Fish", "Cake"]; correctIndex = 0 },
      { id = 2; passageId = 1; questionText = "What was the caterpillar's main emotion?"; options = ["Happy", "Angry", "Hungry", "Sad"]; correctIndex = 2 },
      { id = 3; passageId = 1; questionText = "What kind of animal is the passage about?"; options = ["Bird", "Fish", "Caterpillar", "Butterfly"]; correctIndex = 2 },
      { id = 4; passageId = 1; questionText = "What does the caterpillar do all day?"; options = ["Sleep", "Swim", "Eat", "Sing"]; correctIndex = 2 },
      { id = 5; passageId = 1; questionText = "How does the story begin?"; options = ["Once upon a time", "Long ago", "Yesterday", "Today"]; correctIndex = 0 },
    ]));

    // Questions for passage 2
    questions.add(2, List.fromArray<Question>([
      { id = 6; passageId = 2; questionText = "What does the solar system consist of?"; options = ["Plants", "Food", "Sun, planets, asteroids", "Clouds"]; correctIndex = 2 },
      { id = 7; passageId = 2; questionText = "What is at the center of the solar system?"; options = ["Earth", "Moon", "Sun", "Mars"]; correctIndex = 2 },
      { id = 8; passageId = 2; questionText = "What are comets?"; options = ["Rocks", "Planets", "Icy objects", "Asteroids"]; correctIndex = 2 },
      { id = 9; passageId = 2; questionText = "What orbits the sun?"; options = ["Planets", "Stars", "Clouds", "Houses"]; correctIndex = 0 },
      { id = 10; passageId = 2; questionText = "What is the purpose of the passage?"; options = ["To cook", "To inform about the solar system", "To play games", "To build houses"]; correctIndex = 1 },
    ]));

    // Questions for passage 3
    questions.add(3, List.fromArray<Question>([
      { id = 11; passageId = 3; questionText = "What is photosynthesis?"; options = ["Process by plants", "Process by humans", "Process by animals", "Process by machines"]; correctIndex = 0 },
      { id = 12; passageId = 3; questionText = "What do plants convert during photosynthesis?"; options = ["Sunlight into energy", "Energy into water", "Sunlight into water", "Water into sunlight"]; correctIndex = 0 },
      { id = 13; passageId = 3; questionText = "What is the main function of photosynthesis?"; options = ["Make glucose", "Make oxygen", "Make carbon dioxide", "Make sunlight"]; correctIndex = 0 },
      { id = 14; passageId = 3; questionText = "What process occurs in plant cells?"; options = ["Photosynthesis", "Digestion", "Respiration", "Circulation"]; correctIndex = 0 },
      { id = 15; passageId = 3; questionText = "What is released as a byproduct?"; options = ["Oxygen", "Carbon dioxide", "Nitrogen", "Water"]; correctIndex = 0 },
    ]));
    nextQuestionId := 16;
  };

  // Helper: get current user from session
  func getCurrentUser(caller : Principal) : ?User {
    switch (sessionMap.get(caller)) {
      case (null) { null };
      case (?userId) { users.get(userId) };
    };
  };

  func requireAuth(caller : Principal) : User {
    switch (getCurrentUser(caller)) {
      case (null) { Runtime.trap("Unauthorized: Not logged in") };
      case (?user) { user };
    };
  };

  func requireRole(caller : Principal, requiredRole : UserRole) : User {
    let user = requireAuth(caller);
    if (user.role != requiredRole) {
      Runtime.trap("Unauthorized: Insufficient permissions");
    };
    user;
  };

  // Legacy no-op kept so frontend calls don't fail if still present
  public shared func initializeSystem() : async () {};
  public shared func ensureClassio1Admin() : async () {};

  public type LoginResponse = {
    role : UserRole;
    userId : Text;
  };

  public shared ({ caller }) func login(username : Text, password : Text) : async LoginResponse {
    let userOpt = users.values().toArray().find(
      func(u) { u.username == username and u.password == password }
    );
    switch (userOpt) {
      case (null) { Runtime.trap("Invalid credentials") };
      case (?u) {
        sessionMap.add(caller, u.id);
        { role = u.role; userId = u.id };
      };
    };
  };

  public shared ({ caller }) func logout() : async () {
    sessionMap.remove(caller);
  };

  public shared ({ caller }) func createTeacher(username : Text, password : Text) : async UserId {
    let _ = requireRole(caller, #admin);
    let id = "teacher" # (users.size() + 1).toText();
    let teacher : User = { id; username; password; role = #teacher; grade = null; teacherId = null };
    users.add(id, teacher);
    id;
  };

  public query ({ caller }) func listTeachers() : async [User] {
    let _ = requireRole(caller, #admin);
    users.values().toArray().filter(func(u) { u.role == #teacher });
  };

  public shared ({ caller }) func createStudent(username : Text, password : Text, grade : Nat) : async UserId {
    let teacher = requireRole(caller, #teacher);
    if (grade < 1 or grade > 10) { Runtime.trap("Invalid grade: must be between 1 and 10") };
    let id = "student" # (users.size() + 1).toText();
    let student : User = { id; username; password; role = #student; grade = ?grade; teacherId = ?teacher.id };
    users.add(id, student);
    id;
  };

  public query ({ caller }) func listMyStudents() : async [User] {
    let teacher = requireRole(caller, #teacher);
    users.values().toArray().filter(func(u) {
      u.role == #student and u.teacherId == ?teacher.id
    });
  };

  public query ({ caller }) func getStudentResults(studentId : UserId) : async [TestResult] {
    let teacher = requireRole(caller, #teacher);
    switch (users.get(studentId)) {
      case (null) { Runtime.trap("Student not found") };
      case (?student) {
        if (student.role != #student) { Runtime.trap("Invalid student ID") };
        if (student.teacherId != ?teacher.id) { Runtime.trap("Unauthorized") };
      };
    };
    results.values().toArray().filter(func(r) { r.studentId == studentId });
  };

  public query ({ caller }) func getPassageForGrade(grade : Nat) : async ?Passage {
    let _ = requireAuth(caller);
    if (grade < 1 or grade > 10) { Runtime.trap("Invalid grade") };
    let filtered = passages.values().toArray().filter(func(p) { p.gradeLevel == grade });
    switch (filtered.values().next()) {
      case (?p) { ?p };
      case (null) { null };
    };
  };

  public query ({ caller }) func getQuestionsForPassage(passageId : PassageId) : async [Question] {
    let _ = requireAuth(caller);
    switch (questions.get(passageId)) {
      case (null) { [] };
      case (?qList) { qList.toArray() };
    };
  };

  public shared ({ caller }) func submitTest(
    passageId : PassageId,
    answers : [Nat],
    audioBlobId : ?ExternalBlobId
  ) : async Nat {
    let student = requireRole(caller, #student);
    let qList = switch (questions.get(passageId)) {
      case (null) { Runtime.trap("Invalid passage") };
      case (?qList) { qList.toArray() };
    };
    if (answers.size() != qList.size()) {
      Runtime.trap("Invalid answer count");
    };
    var score = 0;
    var j = 0;
    while (j < answers.size()) {
      if (answers[j] == qList[j].correctIndex) { score += 1 };
      j += 1;
    };
    let result : TestResult = {
      id = nextResultId;
      studentId = student.id;
      passageId;
      answers;
      score;
      timestamp = Time.now();
      audioBlobId;
    };
    results.add(nextResultId, result);
    nextResultId += 1;
    score;
  };

  public query ({ caller }) func getMyResults() : async [TestResult] {
    let student = requireRole(caller, #student);
    results.values().toArray().filter(func(r) { r.studentId == student.id });
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    switch (getCurrentUser(caller)) {
      case (null) { null };
      case (?user) {
        ?{ userId = user.id; username = user.username; role = user.role; grade = user.grade };
      };
    };
  };

  public query ({ caller }) func getUserProfile(userId : UserId) : async ?UserProfile {
    let currentUser = requireAuth(caller);
    if (currentUser.id != userId and currentUser.role != #admin) {
      Runtime.trap("Unauthorized");
    };
    switch (users.get(userId)) {
      case (null) { null };
      case (?user) {
        ?{ userId = user.id; username = user.username; role = user.role; grade = user.grade };
      };
    };
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    let currentUser = requireAuth(caller);
    if (currentUser.id != profile.userId) { Runtime.trap("Unauthorized") };
    switch (users.get(profile.userId)) {
      case (null) { Runtime.trap("User not found") };
      case (?existingUser) {
        users.add(existingUser.id, {
          id = existingUser.id;
          username = profile.username;
          password = existingUser.password;
          role = existingUser.role;
          grade = existingUser.grade;
          teacherId = existingUser.teacherId;
        });
      };
    };
  };
};
