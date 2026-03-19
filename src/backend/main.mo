import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import MixinStorage "blob-storage/Mixin";
import Map "mo:core/Map";
import List "mo:core/List";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";

actor {
  include MixinStorage();

  type UserId         = Text;
  type PassageId      = Nat;
  type ResultId       = Nat;
  type ExternalBlobId = Text;
  type QuestionId     = Nat;

  type UserRole = { #admin; #teacher; #student };

  type User = {
    id        : UserId;
    username  : Text;
    password  : Text;
    role      : UserRole;
    grade     : ?Nat;
    teacherId : ?UserId;
  };

  type Passage = {
    id         : PassageId;
    title      : Text;
    content    : Text;
    gradeLevel : Nat;
  };

  type TestResult = {
    id          : ResultId;
    studentId   : UserId;
    passageId   : PassageId;
    answers     : [Nat];
    score       : Nat;
    timestamp   : Int;
    audioBlobId : ?ExternalBlobId;
  };

  type SkillScores = {
    rhythm        : Nat;
    intonation    : Nat;
    chunking      : Nat;
    pronunciation : Nat;
  };

  public type PassageInfo = {
    id         : PassageId;
    title      : Text;
    content    : Text;
    gradeLevel : Nat;
    subject    : Text;
  };

  public type StudentLevel = {
    enrolledGrade  : Nat;
    effectiveLevel : Nat;
  };

  public type UserProfile = {
    userId        : UserId;
    username      : Text;
    role          : UserRole;
    grade         : ?Nat;
    effectiveLevel : ?Nat;
  };

  public type LoginResponse = { role : UserRole; userId : Text };

  type Question = {
    id           : QuestionId;
    passageId    : PassageId;
    questionText : Text;
    options      : [Text];
    correctIndex : Nat;
  };

  type VocabActivity = {
    id        : Nat;
    studentId : UserId;
    grade     : Nat;
    words     : [Text];
    timestamp : Int;
  };

  type PracticeTest = {
    id        : Nat;
    studentId : UserId;
    passageId : PassageId;
    score     : Nat;
    answers   : [Nat];
    timestamp : Int;
  };

  type WeeklyTest = {
    id         : Nat;
    studentId  : UserId;
    vocabScore : Nat;
    compScore  : Nat;
    totalScore : Nat;
    timestamp  : Int;
  };

  // New score history type
  type ScoreRecord = {
    weekNumber         : Nat;
    comprehensionScore : Nat;
    fluencyScore       : Nat;
    wpm                : Nat;
    pronunciationScore : Nat;
    rhythmScore        : Nat;
  };

  // New vocab mastery type
  type VocabMastery = {
    word     : Text;
    grade    : Nat;
    mastered : Bool;
  };

  // New class progress summary type
  type StudentProgressSummary = {
    studentId                : UserId;
    name                     : Text;
    grade                    : Nat;
    latestComprehensionScore : Nat;
    latestWPM                : Nat;
    weeklyTrend              : [Nat];
    isBehind                 : Bool;
  };

  // ── Stable storage ─────────────────────────────────────────────────────────
  stable var _adminId       : Text = "admin1";
  stable var _adminUsername : Text = "Classio1";
  stable var _adminPassword : Text = "Classio@11";

  // New stable arrays for score histories and vocab masteries
  stable var stableScoreHistories   : [(UserId, [ScoreRecord])]   = [];
  stable var stableVocabMasteries   : [(UserId, [VocabMastery])]  = [];
  stable var stableUsers            : [(UserId, User)]            = [];
  stable var stableResults          : [(ResultId, TestResult)]    = [];
  stable var stableSkillScores      : [(ResultId, SkillScores)]   = [];
  stable var stableEffectiveLevels  : [(UserId, Nat)]             = [];
  stable var stableNextResultId     : Nat                         = 1;

  var users             = Map.empty<UserId,    User>();
  var scoreHistories    = Map.empty<UserId,    List.List<ScoreRecord>>();
  var vocabMasteries    = Map.empty<UserId,    List.List<VocabMastery>>();
  var passages          = Map.empty<PassageId, Passage>();
  var passageSubjects   = Map.empty<PassageId, Text>();
  var results           = Map.empty<ResultId,  TestResult>();
  var sessionMap        = Map.empty<Principal, UserId>();
  var effectiveLevels   = Map.empty<UserId,    Nat>();
  var resultSkillScores = Map.empty<ResultId,  SkillScores>();

  var nextResultId   = 1;

  let questions           = Map.empty<PassageId,   List.List<Question>>();
  let vocabActivities     = Map.empty<UserId,       List.List<VocabActivity>>();
  let practiceTestResults = Map.empty<UserId,       List.List<PracticeTest>>();
  let weeklyTestResults   = Map.empty<UserId,       List.List<WeeklyTest>>();
  var nextPassageId       = 31;
  var nextQuestionId      = 1;
  let baseBlobPath        = "/audio-responses/";

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // ── Helper functions ───────────────────────────────────────────────────────
  func upsertUser(id : UserId, u : User) {
    users.remove(id); users.add(id, u);
  };
  func upsertSession(p : Principal, uid : UserId) {
    sessionMap.remove(p); sessionMap.add(p, uid);
  };
  func upsertEffectiveLevel(uid : UserId, level : Nat) {
    effectiveLevels.remove(uid); effectiveLevels.add(uid, level);
  };
  func upsertResult(rid : ResultId, r : TestResult) {
    results.remove(rid); results.add(rid, r);
  };
  func upsertSkillScores(rid : ResultId, ss : SkillScores) {
    resultSkillScores.remove(rid); resultSkillScores.add(rid, ss);
  };
  func upsertPassage(pid : PassageId, p : Passage, subject : Text) {
    passages.remove(pid); passages.add(pid, p);
    passageSubjects.remove(pid); passageSubjects.add(pid, subject);
  };

  func upsertScoreHistory(userId : UserId, records : List.List<ScoreRecord>) {
    scoreHistories.remove(userId); scoreHistories.add(userId, records);
  };

  func upsertVocabMastery(userId : UserId, records : List.List<VocabMastery>) {
    vocabMasteries.remove(userId); vocabMasteries.add(userId, records);
  };

  func seedAdmin() {
    upsertUser(_adminId, {
      id = _adminId; username = _adminUsername; password = _adminPassword;
      role = #admin; grade = null; teacherId = null;
    });
  };

  // ── Upgrade hooks ──────────────────────────────────────────────────────────
  system func preupgrade() {
    // Convert List.List to arrays for stable storage
    stableScoreHistories := scoreHistories.entries().toArray().map(
      func((userId, list)) {
        let iter = list.values();
        let arr  = iter.toArray();
        (userId, arr);
      }
    );

    stableVocabMasteries := vocabMasteries.entries().toArray().map(
      func((userId, list)) {
        let iter = list.values();
        let arr  = iter.toArray();
        (userId, arr);
      }
    );

    stableUsers           := users.entries().toArray();
    stableResults         := results.entries().toArray();
    stableSkillScores     := resultSkillScores.entries().toArray();
    stableEffectiveLevels := effectiveLevels.entries().toArray();
    stableNextResultId    := nextResultId;
  };

  system func postupgrade() {
    // Restore data from stable storage
    for ((k, arr) in stableScoreHistories.vals()) {
      let list = List.fromArray<ScoreRecord>(arr);
      scoreHistories.add(k, list);
    };

    for ((k, arr) in stableVocabMasteries.vals()) {
      let list = List.fromArray<VocabMastery>(arr);
      vocabMasteries.add(k, list);
    };

    for ((k, v) in stableUsers.vals()) { users.add(k, v); };
    for ((k, v) in stableResults.vals()) { results.add(k, v); };
    for ((k, v) in stableSkillScores.vals()) { resultSkillScores.add(k, v); };
    for ((k, v) in stableEffectiveLevels.vals()) { effectiveLevels.add(k, v); };
    nextResultId := stableNextResultId;
    seedAdmin();

    stableScoreHistories  := [];
    stableVocabMasteries  := [];
    stableUsers           := [];
    stableResults         := [];
    stableSkillScores     := [];
    stableEffectiveLevels := [];
  };

  // ── Existing helpers ──────────────────────────────────────────────────────
  func getCurrentUser(caller : Principal) : ?User {
    switch (sessionMap.get(caller)) {
      case (null) null;
      case (?uid) users.get(uid);
    };
  };

  func requireAuth(caller : Principal) : User {
    switch (getCurrentUser(caller)) {
      case (null) Runtime.trap("Not authenticated");
      case (?u)   u;
    };
  };

  func requireRole(caller : Principal, r : UserRole) : User {
    let u = requireAuth(caller);
    if (u.role != r) Runtime.trap("Unauthorized: Insufficient permissions");
    u;
  };

  func getEffectiveLevel(u : User) : Nat {
    let enrolled = switch (u.grade) { case (?g) g; case null 1 };
    switch (effectiveLevels.get(u.id)) { case (?l) l; case null enrolled };
  };

  func subjectForIndex(n : Nat) : Text {
    let s = ["Science", "History", "Geography"];
    s[n % 3];
  };

  func authorizeStudentAccess(caller : Principal, studentId : UserId) {
    let student = switch (users.get(studentId)) {
      case (null) Runtime.trap("Student not found");
      case (?u) {
        if (u.role != #student) Runtime.trap("Not a student");
        u;
      };
    };
    switch (sessionMap.get(caller)) {
      case (?uid) { if (uid == studentId) return; };
      case null {};
    };
    switch (getCurrentUser(caller)) {
      case (?cu) {
        if (cu.role == #admin) return;
        if (cu.role == #teacher and student.teacherId == ?cu.id) return;
      };
      case null {};
    };
    Runtime.trap("Unauthorized: Cannot access this student's data");
  };

  // ── Auth ───────────────────────────────────────────────────────────────────
  public shared ({ caller }) func login(username : Text, password : Text) : async LoginResponse {
    if (username == _adminUsername and password == _adminPassword) {
      seedAdmin();
      upsertSession(caller, _adminId);
      return { role = #admin; userId = _adminId };
    };
    let found = users.values().toArray().find(func(u) {
      u.username == username and u.password == password
    });
    switch (found) {
      case (null) Runtime.trap("Invalid username or password");
      case (?u) { upsertSession(caller, u.id); { role = u.role; userId = u.id } };
    };
  };

  public shared ({ caller }) func logout() : async () {
    sessionMap.remove(caller);
  };

  // ── Admin session-based ────────────────────────────────────────────────────
  public shared ({ caller }) func createTeacher(username : Text, password : Text) : async UserId {
    let _ = requireRole(caller, #admin);
    let id = "teacher" # (users.size() + 1).toText();
    upsertUser(id, { id; username; password; role = #teacher; grade = null; teacherId = null });
    id;
  };

  public query ({ caller }) func listTeachers() : async [User] {
    let _ = requireRole(caller, #admin);
    users.values().toArray().filter(func(u) { u.role == #teacher });
  };

  // ── Admin credential-based (no session required) ───────────────────────────
  public shared func createTeacherWithCreds(adminPass : Text, teacherUsername : Text, teacherPassword : Text) : async UserId {
    if (adminPass != _adminPassword) Runtime.trap("Invalid admin credentials");
    switch (users.values().toArray().find(func(u) { u.username == teacherUsername })) {
      case (?_) Runtime.trap("Username already exists");
      case null {};
    };
    let id = "teacher" # (users.size() + 1).toText();
    upsertUser(id, { id; username = teacherUsername; password = teacherPassword; role = #teacher; grade = null; teacherId = null });
    id;
  };

  public shared func listTeachersWithCreds(adminPass : Text) : async [User] {
    if (adminPass != _adminPassword) Runtime.trap("Invalid admin credentials");
    users.values().toArray().filter(func(u) { u.role == #teacher });
  };

  // ── Teacher credential-based (no session required) ─────────────────────────
  public shared func createStudentWithCreds(teacherUser : Text, teacherPass : Text, studentUsername : Text, studentPassword : Text, grade : Nat) : async UserId {
    let teacher = users.values().toArray().find(func(u) {
      u.username == teacherUser and u.password == teacherPass and u.role == #teacher
    });
    switch (teacher) {
      case null Runtime.trap("Invalid teacher credentials");
      case (?t) {
        if (grade < 1 or grade > 10) Runtime.trap("Invalid grade: must be 1-10");
        switch (users.values().toArray().find(func(u) { u.username == studentUsername })) {
          case (?_) Runtime.trap("Username already exists");
          case null {};
        };
        let id = "student" # (users.size() + 1).toText();
        upsertUser(id, { id; username = studentUsername; password = studentPassword; role = #student; grade = ?grade; teacherId = ?t.id });
        id;
      };
    };
  };

  public shared func listStudentsWithCreds(teacherUser : Text, teacherPass : Text) : async [User] {
    let teacher = users.values().toArray().find(func(u) {
      u.username == teacherUser and u.password == teacherPass and u.role == #teacher
    });
    switch (teacher) {
      case null Runtime.trap("Invalid teacher credentials");
      case (?t) {
        users.values().toArray().filter(func(u) {
          u.role == #student and u.teacherId == ?t.id
        });
      };
    };
  };

  public shared func getStudentResultsWithCreds(teacherUser : Text, teacherPass : Text, studentId : UserId) : async [TestResult] {
    let teacher = users.values().toArray().find(func(u) {
      u.username == teacherUser and u.password == teacherPass and u.role == #teacher
    });
    switch (teacher) {
      case null Runtime.trap("Invalid teacher credentials");
      case (?t) {
        switch (users.get(studentId)) {
          case (null) Runtime.trap("Student not found");
          case (?s) {
            if (s.role != #student) Runtime.trap("Invalid student ID");
            if (s.teacherId != ?t.id) Runtime.trap("Unauthorized: Not your student");
          };
        };
        results.values().toArray().filter(func(r) { r.studentId == studentId });
      };
    };
  };

  // ── Teacher session-based ──────────────────────────────────────────────────
  public shared ({ caller }) func createStudent(username : Text, password : Text, grade : Nat) : async UserId {
    let teacher = requireRole(caller, #teacher);
    if (grade < 1 or grade > 10) Runtime.trap("Invalid grade: must be 1-10");
    let id = "student" # (users.size() + 1).toText();
    upsertUser(id, { id; username; password; role = #student; grade = ?grade; teacherId = ?teacher.id });
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
      case (null) Runtime.trap("Student not found");
      case (?s) {
        if (s.role != #student) Runtime.trap("Invalid student ID");
        if (s.teacherId != ?teacher.id) Runtime.trap("Unauthorized: Not your student");
      };
    };
    results.values().toArray().filter(func(r) { r.studentId == studentId });
  };

  // ── Student endpoints ──────────────────────────────────────────────────────
  public query ({ caller }) func getPassageForStudent(userId : UserId) : async ?PassageInfo {
    authorizeStudentAccess(caller, userId);
    let student = switch (users.get(userId)) {
      case (?u) u; case null Runtime.trap("Student not found");
    };
    let level   = getEffectiveLevel(student);
    let count   = results.values().toArray().filter(func(r) { r.studentId == student.id }).size();
    let subject = subjectForIndex(count);
    let matchSubj = passages.values().toArray().find(func(p) {
      p.gradeLevel == level and
      (switch (passageSubjects.get(p.id)) { case (?s) s == subject; case null false })
    });
    switch (matchSubj) {
      case (?p) {
        let sub = switch (passageSubjects.get(p.id)) { case (?s) s; case null "Science" };
        ?{ id = p.id; title = p.title; content = p.content; gradeLevel = p.gradeLevel; subject = sub };
      };
      case (null) {
        switch (passages.values().toArray().find(func(p) { p.gradeLevel == level })) {
          case (null) null;
          case (?p) {
            let sub = switch (passageSubjects.get(p.id)) { case (?s) s; case null "Science" };
            ?{ id = p.id; title = p.title; content = p.content; gradeLevel = p.gradeLevel; subject = sub };
          };
        };
      };
    };
  };

  public query ({ caller }) func getStudentEffectiveLevel(userId : UserId) : async StudentLevel {
    authorizeStudentAccess(caller, userId);
    let student = switch (users.get(userId)) {
      case (?u) u; case null Runtime.trap("Student not found");
    };
    let enrolled  = switch (student.grade) { case (?g) g; case null 1 };
    let effective = getEffectiveLevel(student);
    { enrolledGrade = enrolled; effectiveLevel = effective };
  };

  public shared ({ caller }) func submitTestWithSkills(
    userId      : UserId,
    passageId   : PassageId,
    skillScores : SkillScores,
    audioBlobId : ?ExternalBlobId
  ) : async Nat {
    authorizeStudentAccess(caller, userId);
    let student = switch (users.get(userId)) {
      case (?u) u; case null Runtime.trap("Student not found");
    };
    let enrolled = switch (student.grade) { case (?g) g; case null 1 };
    let current  = getEffectiveLevel(student);
    let total    = skillScores.rhythm + skillScores.intonation + skillScores.chunking + skillScores.pronunciation;
    let newLevel : Nat = if (total < 16) {
      if (current > 1) current - 1 else 1;
    } else {
      if (current < enrolled) current + 1 else enrolled;
    };
    upsertEffectiveLevel(student.id, newLevel);
    let rid = nextResultId;
    upsertResult(rid, {
      id = rid; studentId = student.id; passageId;
      answers = []; score = total; timestamp = Time.now(); audioBlobId;
    });
    upsertSkillScores(rid, skillScores);
    nextResultId += 1;
    total;
  };

  public shared ({ caller }) func submitTest(
    userId      : UserId,
    passageId   : PassageId,
    answers     : [Nat],
    audioBlobId : ?ExternalBlobId
  ) : async Nat {
    authorizeStudentAccess(caller, userId);
    let student = switch (users.get(userId)) {
      case (?u) u; case null Runtime.trap("Student not found");
    };
    let rid = nextResultId;
    upsertResult(rid, {
      id = rid; studentId = student.id; passageId;
      answers; score = 0; timestamp = Time.now(); audioBlobId;
    });
    nextResultId += 1;
    0;
  };

  public query ({ caller }) func getResultsForStudent(userId : UserId) : async [TestResult] {
    authorizeStudentAccess(caller, userId);
    let student = switch (users.get(userId)) {
      case (?u) u; case null Runtime.trap("Student not found");
    };
    results.values().toArray().filter(func(r) { r.studentId == student.id });
  };

  public query ({ caller }) func getPassageForGrade(grade : Nat) : async ?Passage {
    let _ = requireAuth(caller);
    let arr = passages.values().toArray().filter(func(p) { p.gradeLevel == grade });
    if (arr.size() > 0) ?arr[0] else null;
  };

  // ── New Score History methods ──────────────────────────────────────────────
  public shared ({ caller }) func addScoreHistory(userId : UserId, record : ScoreRecord) : async () {
    authorizeStudentAccess(caller, userId);
    let existing = switch (scoreHistories.get(userId)) {
      case (?list) { list.add(record); list };
      case (null)  { let newList = List.empty<ScoreRecord>(); newList.add(record); newList };
    };
    upsertScoreHistory(userId, existing);
  };

  public query ({ caller }) func getScoreHistory(userId : UserId) : async [ScoreRecord] {
    authorizeStudentAccess(caller, userId);
    switch (scoreHistories.get(userId)) {
      case (null) { [] };
      case (?list) {
        let iter = list.values();
        let arr  = iter.toArray();
        arr;
      };
    };
  };

  // ── Vocab Mastery methods ─────────────────────────────────────────────────
  public shared ({ caller }) func updateVocabMastery(userId : UserId, word : Text, grade : Nat, mastered : Bool) : async () {
    authorizeStudentAccess(caller, userId);
    let newRecord = { word; grade; mastered };
    let existing  = switch (vocabMasteries.get(userId)) {
      case (?list) {
        let updated = list.filter(func(r) { r.word != word }); // Remove old entries for this word
        updated.add(newRecord);
        updated;
      };
      case (null) {
        let newList = List.empty<VocabMastery>();
        newList.add(newRecord);
        newList;
      };
    };
    upsertVocabMastery(userId, existing);
  };

  public query ({ caller }) func getVocabMastery(userId : UserId) : async [VocabMastery] {
    authorizeStudentAccess(caller, userId);
    switch (vocabMasteries.get(userId)) {
      case (null) { [] };
      case (?list) {
        let iter = list.values();
        let arr  = iter.toArray();
        arr;
      };
    };
  };

  // ── Class Progress methods ──────────────────────────────────────────────
  public query ({ caller }) func getClassProgress(teacherId : UserId) : async [StudentProgressSummary] {
    // Authorization: caller must be the teacher or an admin
    let currentUser = requireAuth(caller);
    let teacher = switch (users.get(teacherId)) {
      case (null) Runtime.trap("Teacher not found");
      case (?t) {
        if (t.role != #teacher) Runtime.trap("Not a teacher");
        t;
      };
    };

    // Check authorization: caller must be the teacher themselves or an admin
    if (currentUser.id != teacher.id and currentUser.role != #admin) {
      Runtime.trap("Unauthorized: Can only view your own class progress");
    };

    let summaries = users.values().toArray().filter(func(u) {
      u.role == #student and u.teacherId == ?teacher.id
    }).map(func(student) {
      let scores = switch (scoreHistories.get(student.id)) {
        case (null) { [] };
        case (?list) {
          let iter = list.values();
          let arr  = iter.toArray();
          arr;
        };
      };
      let latest = if (scores.size() > 0) { scores[0].comprehensionScore } else { 0 };
      let weeklyTrend = scores.sliceToArray(0, Nat.min(4, scores.size())).map(func(r : ScoreRecord) : Nat { r.comprehensionScore });
      let isBehind    = latest < 60;
      {
        studentId                = student.id;
        name                     = student.username;
        grade                    = switch (student.grade) { case (?g) g; case null 1 };
        latestComprehensionScore = latest;
        latestWPM                = if (scores.size() > 0) { scores[0].wpm } else { 0 };
        weeklyTrend;
        isBehind;
      };
    });

    summaries;
  };

  // ── Profile ────────────────────────────────────────────────────────────────
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    switch (getCurrentUser(caller)) {
      case (null) null;
      case (?u) {
        ?{ userId = u.id; username = u.username; role = u.role;
           grade = u.grade; effectiveLevel = ?(getEffectiveLevel(u)) };
      };
    };
  };

  public query ({ caller }) func getUserProfile(userId : UserId) : async ?UserProfile {
    let cu = requireAuth(caller);
    if (cu.id != userId and cu.role != #admin)
      Runtime.trap("Unauthorized: Can only view your own profile");
    switch (users.get(userId)) {
      case (null) null;
      case (?u) {
        ?{ userId = u.id; username = u.username; role = u.role;
           grade = u.grade; effectiveLevel = ?(getEffectiveLevel(u)) };
      };
    };
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    let cu = requireAuth(caller);
    if (cu.id != profile.userId) Runtime.trap("Unauthorized");
    switch (users.get(profile.userId)) {
      case (null) Runtime.trap("User not found");
      case (?u) {
        upsertUser(u.id, { id = u.id; username = profile.username; password = u.password;
          role = u.role; grade = u.grade; teacherId = u.teacherId });
      };
    };
  };

  public shared func initializeSystem()    : async () {};
  public shared func ensureClassio1Admin() : async () {};
};
