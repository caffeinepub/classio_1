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
    teacherId : ?UserId; // Track which teacher created this student
  };

  type Passage = {
    id : PassageId;
    title : Text;
    content : Text;
    gradeLevel : Nat; // 1-10
  };

  type Question = {
    id : QuestionId;
    passageId : PassageId;
    questionText : Text;
    options : [Text]; // 4 options
    correctIndex : Nat; // 0-3
  };

  type TestResult = {
    id : ResultId;
    studentId : UserId;
    passageId : PassageId;
    answers : [Nat]; // 5 chosen option indices
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
  let sessionMap = Map.empty<Principal, UserId>(); // Map Principal to UserId for session management
  var nextPassageId = 1;
  var nextQuestionId = 1;
  var nextResultId = 1;

  // Authentication logic for AccessControl module (required by instructions)
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  let baseBlobPath = "/audio-responses/";

  // Helper function to get current user from session
  func getCurrentUser(caller : Principal) : ?User {
    switch (sessionMap.get(caller)) {
      case (null) { null };
      case (?userId) { users.get(userId) };
    };
  };

  // Helper function to require authentication
  func requireAuth(caller : Principal) : User {
    switch (getCurrentUser(caller)) {
      case (null) { Runtime.trap("Unauthorized: Not logged in") };
      case (?user) { user };
    };
  };

  // Helper function to require specific role
  func requireRole(caller : Principal, requiredRole : UserRole) : User {
    let user = requireAuth(caller);
    if (user.role != requiredRole) {
      Runtime.trap("Unauthorized: Insufficient permissions");
    };
    user;
  };

  public shared ({ caller }) func initializeSystem() : async () {
    if (users.size() > 0) { Runtime.trap("System already initialized") };
    let admin1 : User = {
      id = "admin1";
      username = "Siddiqui";
      password = "Siddiqui11";
      role = #admin;
      grade = null;
      teacherId = null;
    };
    users.add("admin1", admin1);
    let admin2 : User = {
      id = "admin2";
      username = "Classio1";
      password = "Classio@11";
      role = #admin;
      grade = null;
      teacherId = null;
    };
    users.add("admin2", admin2);
    addInitialContent();
  };

  // Migration: add Classio1 admin if not already present
  public shared func ensureClassio1Admin() : async () {
    let exists = users.values().toArray().find(func(u) { u.username == "Classio1" });
    switch (exists) {
      case (?_) { /* already exists */ };
      case (null) {
        let admin2 : User = {
          id = "admin2";
          username = "Classio1";
          password = "Classio@11";
          role = #admin;
          grade = null;
          teacherId = null;
        };
        users.add("admin2", admin2);
      };
    };
  };

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
        // Create session
        sessionMap.add(caller, u.id);
        {
          role = u.role;
          userId = u.id;
        };
      };
    };
  };

  public shared ({ caller }) func logout() : async () {
    sessionMap.remove(caller);
  };

  public shared ({ caller }) func createTeacher(username : Text, password : Text) : async UserId {
    let _ = requireRole(caller, #admin);

    let id = "teacher" # (users.size() + 1).toText();
    let teacher : User = {
      id;
      username;
      password;
      role = #teacher;
      grade = null;
      teacherId = null;
    };
    users.add(id, teacher);
    id;
  };

  public query ({ caller }) func listTeachers() : async [User] {
    let _ = requireRole(caller, #admin);
    users.values().toArray().filter(func(u) { u.role == #teacher });
  };

  public shared ({ caller }) func createStudent(username : Text, password : Text, grade : Nat) : async UserId {
    let teacher = requireRole(caller, #teacher);

    if (grade < 1 or grade > 10) {
      Runtime.trap("Invalid grade: must be between 1 and 10");
    };

    let id = "student" # (users.size() + 1).toText();
    let student : User = {
      id;
      username;
      password;
      role = #student;
      grade = ?grade;
      teacherId = ?teacher.id;
    };
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

    // Verify the student belongs to this teacher
    switch (users.get(studentId)) {
      case (null) { Runtime.trap("Student not found") };
      case (?student) {
        if (student.role != #student) {
          Runtime.trap("Invalid student ID");
        };
        if (student.teacherId != ?teacher.id) {
          Runtime.trap("Unauthorized: Can only view your own students' results");
        };
      };
    };

    results.values().toArray().filter(func(r) { r.studentId == studentId });
  };

  public query ({ caller }) func getPassageForGrade(grade : Nat) : async ?Passage {
    let _ = requireAuth(caller);

    if (grade < 1 or grade > 10) {
      Runtime.trap("Invalid grade: must be between 1 and 10");
    };

    let passageArray = passages.values().toArray();
    let filteredPassages = passageArray.filter(func(p) { p.gradeLevel == grade });
    switch (filteredPassages.values().next()) {
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
      Runtime.trap("Invalid answer count: expected " # qList.size().toText() # " answers") 
    };

    // Validate all answer indices
    var i = 0;
    while (i < answers.size()) {
      if (answers[i] > 3) {
        Runtime.trap("Invalid answer index: must be 0-3");
      };
      i += 1;
    };

    var score = 0;
    var j = 0;
    while (j < answers.size()) {
      let correct = qList[j].correctIndex;
      if (answers[j] == correct) { score += 1 };
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

  // User profile functions required by instructions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };

    switch (getCurrentUser(caller)) {
      case (null) { null };
      case (?user) {
        ?{
          userId = user.id;
          username = user.username;
          role = user.role;
          grade = user.grade;
        };
      };
    };
  };

  public query ({ caller }) func getUserProfile(userId : UserId) : async ?UserProfile {
    let currentUser = requireAuth(caller);

    // Users can view their own profile, admins can view any profile
    if (currentUser.id != userId and currentUser.role != #admin) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };

    switch (users.get(userId)) {
      case (null) { null };
      case (?user) {
        ?{
          userId = user.id;
          username = user.username;
          role = user.role;
          grade = user.grade;
        };
      };
    };
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };

    let currentUser = requireAuth(caller);

    // Users can only update their own profile
    if (currentUser.id != profile.userId) {
      Runtime.trap("Unauthorized: Can only update your own profile");
    };

    switch (users.get(profile.userId)) {
      case (null) { Runtime.trap("User not found") };
      case (?existingUser) {
        // Update user with new profile data (username only, role and grade are immutable)
        let updatedUser : User = {
          id = existingUser.id;
          username = profile.username;
          password = existingUser.password;
          role = existingUser.role;
          grade = existingUser.grade;
          teacherId = existingUser.teacherId;
        };
        users.add(existingUser.id, updatedUser);
      };
    };
  };

  func addInitialContent() : () {
    // Passages
    let passage1 : Passage = {
      id = nextPassageId;
      title = "The Hungry Caterpillar";
      content = "Once upon a time there was a very hungry caterpillar. He ate leaves all day";
      gradeLevel = 1;
    };
    passages.add(nextPassageId, passage1);
    nextPassageId += 1;

    let passage2 : Passage = {
      id = nextPassageId;
      title = "The Solar System";
      content = "The solar system consists of the sun, planets, asteroids, and comets";
      gradeLevel = 5;
    };
    passages.add(nextPassageId, passage2);
    nextPassageId += 1;

    let passage3 : Passage = {
      id = nextPassageId;
      title = "Photosynthesis";
      content = "Photosynthesis is the process by which plants convert sunlight into energy.";
      gradeLevel = 9;
    };
    passages.add(nextPassageId, passage3);
    nextPassageId += 1;

    // Questions for each passage
    let questions1 = List.fromArray<Question>([
      { id = 1; passageId = 1; questionText = "What did the caterpillar eat?"; options = ["Leaves", "Meat", "Fish", "Cake"]; correctIndex = 0 },
      { id = 2; passageId = 1; questionText = "What was the caterpillar's main emotion?"; options = ["Happy", "Angry", "Hungry", "Sad"]; correctIndex = 2 },
      { id = 3; passageId = 1; questionText = "What kind of animal is the passage about?"; options = ["Bird", "Fish", "Caterpillar", "Butterfly"]; correctIndex = 2 },
      { id = 4; passageId = 1; questionText = "What does the caterpillar do all day?"; options = ["Sleep", "Swim", "Eat", "Sing"]; correctIndex = 2 },
      { id = 5; passageId = 1; questionText = "How does the story begin?"; options = ["Once upon a time", "Long ago", "Yesterday", "Today"]; correctIndex = 0 },
    ]);
    questions.add(1, questions1);

    let questions2 = List.fromArray<Question>([
      { id = 6; passageId = 2; questionText = "What does the solar system consist of?"; options = ["Plants", "Food", "Sun, planets, asteroids", "Clouds"]; correctIndex = 2 },
      { id = 7; passageId = 2; questionText = "What is at the center of the solar system?"; options = ["Earth", "Moon", "Sun", "Mars"]; correctIndex = 2 },
      { id = 8; passageId = 2; questionText = "What are comets?"; options = ["Rocks", "Planets", "Icy objects", "Asteroids"]; correctIndex = 2 },
      { id = 9; passageId = 2; questionText = "What orbits the sun?"; options = ["Planets", "Stars", "Clouds", "Houses"]; correctIndex = 0 },
      { id = 10; passageId = 2; questionText = "What is the purpose of the passage?"; options = ["To cook", "To inform about the solar system", "To play games", "To build houses"]; correctIndex = 1 },
    ]);
    questions.add(2, questions2);

    let questions3 = List.fromArray<Question>([
      { id = 11; passageId = 3; questionText = "What is photosynthesis?"; options = ["Process by plants", "Process by humans", "Process by animals", "Process by machines"]; correctIndex = 0 },
      { id = 12; passageId = 3; questionText = "What do plants convert during photosynthesis?"; options = ["Sunlight into energy", "Energy into water", "Sunlight into water", "Water into sunlight"]; correctIndex = 0 },
      { id = 13; passageId = 3; questionText = "What is the main function of photosynthesis?"; options = ["Make glucose", "Make oxygen", "Make carbon dioxide", "Make sunlight"]; correctIndex = 0 },
      { id = 14; passageId = 3; questionText = "What process occurs in plant cells?"; options = ["Photosynthesis", "Digestion", "Respiration", "Circulation"]; correctIndex = 0 },
      { id = 15; passageId = 3; questionText = "What is released as a byproduct?"; options = ["Oxygen", "Carbon dioxide", "Nitrogen", "Water"]; correctIndex = 0 },
    ]);
    questions.add(3, questions3);
  };
};
