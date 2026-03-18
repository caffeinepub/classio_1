import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import MixinStorage "blob-storage/Mixin";
import Map "mo:core/Map";
import List "mo:core/List";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";



actor {
  include MixinStorage();

  type UserId      = Text;
  type PassageId   = Nat;
  type QuestionId  = Nat;
  type ResultId    = Nat;
  type ExternalBlobId = Text;

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

  type Question = {
    id           : QuestionId;
    passageId    : PassageId;
    questionText : Text;
    options      : [Text];
    correctIndex : Nat;
  };

  type TestResult = {
    id         : ResultId;
    studentId  : UserId;
    passageId  : PassageId;
    answers    : [Nat];
    score      : Nat;
    timestamp  : Int;
    audioBlobId : ?ExternalBlobId;
  };

  type SkillScores = {
    rhythm       : Nat;
    intonation   : Nat;
    chunking     : Nat;
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

  // New types for analytics
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
    id          : Nat;
    studentId   : UserId;
    vocabScore  : Nat;
    compScore   : Nat;
    totalScore  : Nat;
    timestamp   : Int;
  };

  // New state fields (persistent)
  let vocabActivities      = Map.empty<UserId, List.List<VocabActivity>>();
  let practiceTestResults  = Map.empty<UserId, List.List<PracticeTest>>();
  let weeklyTestResults    = Map.empty<UserId, List.List<WeeklyTest>>();

  // Stable persistent state fields
  let users       = Map.empty<UserId,      User>();
  let passages    = Map.empty<PassageId,   Passage>();
  let questions   = Map.empty<PassageId,   List.List<Question>>();
  let results     = Map.empty<ResultId,    TestResult>();
  let sessionMap  = Map.empty<Principal,   UserId>();
  let passageSubjects = Map.empty<PassageId, Text>();
  let effectiveLevels = Map.empty<UserId, Nat>();
  let resultSkillScores = Map.empty<ResultId, SkillScores>();

  var nextPassageId      = 1;
  var nextQuestionId     = 1;
  var nextResultId       = 1;
  let baseBlobPath       = "/audio-responses/";

  // Access control state (persistent)
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Upsert helper: remove then add (to avoid persistent let hot reload issues)
  func upsertUser(id : UserId, u : User) {
    users.remove(id);
    users.add(id, u);
  };
  func upsertSession(p : Principal, uid : UserId) {
    sessionMap.remove(p);
    sessionMap.add(p, uid);
  };
  func upsertEffectiveLevel(uid : UserId, level : Nat) {
    effectiveLevels.remove(uid);
    effectiveLevels.add(uid, level);
  };
  func upsertResult(rid : ResultId, r : TestResult) {
    results.remove(rid);
    results.add(rid, r);
  };
  func upsertSkillScores(rid : ResultId, ss : SkillScores) {
    resultSkillScores.remove(rid);
    resultSkillScores.add(rid, ss);
  };
  func upsertPassage(pid : PassageId, p : Passage, subject : Text) {
    passages.remove(pid);
    passages.add(pid, p);
    passageSubjects.remove(pid);
    passageSubjects.add(pid, subject);
  };

  // ── Seed ────────────────────────────────────────────────────────────────────────
  do {
    upsertUser("admin1", {
      id = "admin1"; username = "Classio1"; password = "Classio@11";
      role = #admin; grade = null; teacherId = null;
    });

    func addPassage(pid : PassageId, title : Text, content : Text, grade : Nat, subject : Text) {
      upsertPassage(pid, { id = pid; title; content; gradeLevel = grade }, subject);
    };

    // Grade 1
    addPassage(1,  "Plants Need Sun",        "Plants need sunlight to grow. They also need water and soil. A seed grows into a plant when it gets what it needs.", 1, "Science");
    addPassage(2,  "My Community",            "Long ago, people lived in small villages. They helped each other every day. Communities have changed, but people still help one another.", 1, "History");
    addPassage(3,  "Land and Water",          "Earth has land and water. Mountains are very tall. Rivers carry water to the sea.", 1, "Geography");
    // Grade 2
    addPassage(4,  "Animals and Their Homes", "Animals live in different places called habitats. Fish live in water. Birds build nests in trees. Bears sleep in caves during winter.", 2, "Science");
    addPassage(5,  "Early Explorers",         "Many years ago, brave explorers sailed on big ships. They wanted to find new lands. Some explorers made maps of the places they found.", 2, "History");
    addPassage(6,  "Continents of the World", "The world has seven continents. Asia is the biggest continent. Antarctica is the coldest place on Earth. People live on every continent except Antarctica.", 2, "Geography");
    // Grade 3
    addPassage(7,  "The Water Cycle",         "Water moves around the Earth in a cycle. The sun heats water and turns it into vapor. The vapor rises and forms clouds. Rain falls from clouds and fills rivers and oceans.", 3, "Science");
    addPassage(8,  "Ancient Egypt",           "Ancient Egypt was a great civilization that began near the Nile River. The Egyptians built huge pyramids as tombs for their pharaohs. They also invented one of the first writing systems called hieroglyphics.", 3, "History");
    addPassage(9,  "Deserts and Rainforests", "A desert is a dry place that receives very little rain. The Sahara in Africa is the largest hot desert. Rainforests are wet, warm, and full of plants and animals.", 3, "Geography");
    // Grade 4
    addPassage(10, "Forces and Motion",       "A force is a push or pull that can change how an object moves. Gravity pulls everything toward Earth. Friction slows things down. Scientists measure forces in units called Newtons.", 4, "Science");
    addPassage(11, "The Roman Empire",        "The Roman Empire was one of the most powerful civilizations in history. Romans built roads, aqueducts, and great buildings. At its peak the empire covered much of Europe, North Africa, and parts of Asia. It fell in 476 AD.", 4, "History");
    addPassage(12, "Climate Zones",           "The Earth is divided into climate zones based on temperature and rainfall. The tropics near the equator are hot and humid. Temperate zones have four seasons. Polar regions near the poles are freezing cold most of the year.", 4, "Geography");
    // Grade 5
    addPassage(13, "The Solar System",        "Our solar system has the Sun and eight planets orbiting it. The four inner planets are rocky, while the outer planets are gas giants. Jupiter is the largest planet. Scientists use telescopes and spacecraft to explore our solar system.", 5, "Science");
    addPassage(14, "The Silk Road",            "The Silk Road was an ancient network of trade routes connecting China to the Mediterranean Sea. Merchants traveled thousands of miles to trade silk, spices, and other goods. Ideas and religions also spread along these routes, shaping civilizations.", 5, "History");
    addPassage(15, "River Systems and Deltas", "Rivers shape the land around them as they flow toward the sea. They carry sediment and deposit it at their mouths, forming deltas. The Amazon carries more water than any other river. River valleys were home to early civilizations.", 5, "Geography");
    // Grade 6
    addPassage(16, "Cells: Building Blocks of Life",  "All living organisms are made of cells, the basic unit of life. Plant cells contain a cell wall and chloroplasts that allow photosynthesis. The nucleus contains DNA with genetic instructions. Scientists use microscopes to study these tiny structures.", 6, "Science");
    addPassage(17, "The Renaissance",                  "The Renaissance was a period of cultural rebirth in Europe that began in Italy around the 14th century. Artists and scientists challenged old ways of thinking. Leonardo da Vinci was both a painter and an inventor. The printing press helped spread Renaissance ideas across Europe.", 6, "History");
    addPassage(18, "Monsoons and Seasonal Winds",      "Monsoons are seasonal wind patterns that bring heavy rainfall to large parts of Asia, Africa, and Australia. Farmers depend on monsoon rains to irrigate crops. When monsoons fail, droughts can devastate entire regions and lead to food shortages.", 6, "Geography");
    // Grade 7
    addPassage(19, "Ecosystems and Food Webs",  "An ecosystem is a community of organisms interacting with each other and their environment. Producers convert solar energy into food through photosynthesis. Consumers eat producers or other consumers. Decomposers return nutrients to the soil. Removing one species can disrupt the entire food web.", 7, "Science");
    addPassage(20, "The Industrial Revolution", "The Industrial Revolution began in Britain in the late 18th century and transformed how goods were made. Steam engines powered factories and locomotives, enabling mass production and faster transport. Workers moved to cities, but harsh conditions prompted new labor reform movements.", 7, "History");
    addPassage(21, "Plate Tectonics",           "The Earth's lithosphere is divided into tectonic plates that move slowly over time. Colliding plates form mountain ranges or deep ocean trenches. Diverging plates create new ocean floor at mid-ocean ridges. Earthquakes and volcanoes occur most often at plate boundaries.", 7, "Geography");
    // Grade 8
    addPassage(22, "Genetics and Heredity",      "Genetics studies how traits are inherited across generations. Gregor Mendel discovered basic principles of heredity using pea plants. Traits are determined by genes that come in pairs called alleles. Dominant alleles mask recessive ones. Modern genetics includes DNA sequencing and gene-related disease research.", 8, "Science");
    addPassage(23, "World War I and Its Causes", "World War I, fought from 1914 to 1918, was triggered by the assassination of Archduke Franz Ferdinand. Underlying causes included militarism, alliances, imperial rivalries, and rising nationalism. New technologies made warfare more devastating than ever. The war's end reshaped borders and planted the seeds for World War II.", 8, "History");
    addPassage(24, "Ocean Currents and Climate", "Ocean currents are large-scale water movements driven by wind, temperature, and Earth's rotation. Warm currents like the Gulf Stream carry heat from the tropics toward polar regions, moderating nearby coastlines. Cold currents bring nutrients to the surface, supporting rich marine life. Disruptions to ocean circulation affect global climate patterns.", 8, "Geography");
    // Grade 9
    addPassage(25, "Photosynthesis and Cellular Respiration", "Photosynthesis and cellular respiration are complementary biochemical processes. In photosynthesis, chloroplasts use light energy to convert carbon dioxide and water into glucose and oxygen. Cellular respiration in mitochondria breaks down glucose to release ATP energy, producing carbon dioxide and water. Together they maintain the carbon cycle and enable energy flow through ecosystems.", 9, "Science");
    addPassage(26, "The Cold War and Global Tensions",        "The Cold War was a period of geopolitical tension between the United States and Soviet Union from 1947 to 1991. Rather than direct conflict, the rivalry was expressed through arms races, proxy wars, and ideological competition. The Cuban Missile Crisis brought the world close to nuclear war. The Cold War ended with the dissolution of the Soviet Union, reshaping the international order.", 9, "History");
    addPassage(27, "Urbanization and Megacities",             "Urbanization, the migration from rural to urban areas, is a defining trend of the modern era. More than half the world's population now lives in cities. Megacities with over ten million people face challenges including infrastructure strain, air pollution, housing shortages, and inequality. Sustainable urban planning with green spaces and public transport is essential for managing rapid growth.", 9, "Geography");
    // Grade 10
    addPassage(28, "Quantum Mechanics and Modern Physics",    "Quantum mechanics describes the behavior of matter and energy at the subatomic scale where classical physics breaks down. Particles exhibit wave-particle duality, behaving as waves or particles depending on experimental context. The Heisenberg Uncertainty Principle states that position and momentum cannot both be precisely known simultaneously. These principles underpin transformative technologies including semiconductors, lasers, and MRI scanners.", 10, "Science");
    addPassage(29, "Colonialism and Its Legacy",              "European colonialism, reaching its peak in the 19th and early 20th centuries, reshaped political and economic structures across Africa, Asia, and the Americas. Colonial powers extracted resources and suppressed indigenous cultures. Decolonization movements of the mid-20th century led to independence for dozens of nations, yet economic disparities and ethnic conflicts persist as lasting legacies of colonial rule.", 10, "History");
    addPassage(30, "Climate Change and Environmental Policy", "Climate change, driven by fossil fuel combustion and deforestation, represents one of the most complex challenges of the contemporary era. Rising atmospheric greenhouse gases trap heat, causing temperature increases, glacial retreat, sea-level rise, and extreme weather events. International agreements like the Paris Accord seek coordinated emissions reductions, yet tensions between economic development and environmental sustainability continue to complicate global climate action.", 10, "Geography");

    nextPassageId := 31;
    nextResultId  := 1;
  };

  // ── Internal helpers ────────────────────────────────────────────────────────────
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

  // Authorization helper for student data access
  // Allows: the student themselves, their teacher, or any admin
  func authorizeStudentAccess(caller : Principal, studentId : UserId) {
    let student = switch (users.get(studentId)) {
      case (null) Runtime.trap("Student not found");
      case (?u) {
        if (u.role != #student) Runtime.trap("Not a student");
        u;
      };
    };

    // Check if caller is the student via session
    switch (sessionMap.get(caller)) {
      case (?uid) {
        if (uid == studentId) return; // Student accessing their own data
      };
      case null {};
    };

    // Check if caller is authenticated and has permission
    switch (getCurrentUser(caller)) {
      case (?callerUser) {
        // Admin can access any student
        if (callerUser.role == #admin) return;
        
        // Teacher can access their own students
        if (callerUser.role == #teacher and student.teacherId == ?callerUser.id) return;
      };
      case null {};
    };

    Runtime.trap("Unauthorized: Cannot access this student's data");
  };

  // ── Auth endpoints ─────────────────────────────────────────────────────────────
  public shared ({ caller }) func login(username : Text, password : Text) : async LoginResponse {
    let found = users.values().toArray().find(func(u) {
      u.username == username and u.password == password
    });
    switch (found) {
      case (null) Runtime.trap("Invalid credentials");
      case (?u) {
        upsertSession(caller, u.id);
        { role = u.role; userId = u.id };
      };
    };
  };

  public shared ({ caller }) func logout() : async () {
    sessionMap.remove(caller);
  };

  // ── Admin endpoints ────────────────────────────────────────────────────────────
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

  // ── Teacher endpoints ──────────────────────────────────────────────────────────
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

  // ── Student test endpoints ─────────────────────────────────────────────────────
  // These endpoints take userId directly because all browser sessions share the
  // same anonymous ICP principal when username/password auth is used.
  // CRITICAL: Must verify caller has permission to access this student's data.

  public query ({ caller }) func getPassageForStudent(userId : UserId) : async ?PassageInfo {
    authorizeStudentAccess(caller, userId);
    
    let student = switch (users.get(userId)) {
      case (?u) u;
      case null Runtime.trap("Student not found");
    };
    
    let level   = getEffectiveLevel(student);
    let count   = results.values().toArray().filter(func(r) { r.studentId == student.id }).size();
    let subject = subjectForIndex(count);

    let match = passages.values().toArray().find(func(p) {
      p.gradeLevel == level and
      (switch (passageSubjects.get(p.id)) { case (?s) s == subject; case null false })
    });
    switch (match) {
      case (?p) {
        let sub = switch (passageSubjects.get(p.id)) { case (?s) s; case null "Science" };
        ?{ id = p.id; title = p.title; content = p.content; gradeLevel = p.gradeLevel; subject = sub };
      };
      case (null) {
        // Fallback: any passage at this level
        let any = passages.values().toArray().find(func(p) { p.gradeLevel == level });
        switch (any) {
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
      case (?u) u;
      case null Runtime.trap("Student not found");
    };
    
    let enrolled = switch (student.grade) { case (?g) g; case null 1 };
    let effective = getEffectiveLevel(student);
    { enrolledGrade = enrolled; effectiveLevel = effective };
  };

  public shared ({ caller }) func submitTestWithSkills(
    userId       : UserId,
    passageId    : PassageId,
    skillScores  : SkillScores,
    audioBlobId  : ?ExternalBlobId
  ) : async Nat {
    authorizeStudentAccess(caller, userId);
    
    let student = switch (users.get(userId)) {
      case (?u) u;
      case null Runtime.trap("Student not found");
    };
    
    let enrolled = switch (student.grade) { case (?g) g; case null 1 };
    let current  = getEffectiveLevel(student);

    let total = skillScores.rhythm + skillScores.intonation +
                skillScores.chunking + skillScores.pronunciation;
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
      case (?u) u;
      case null Runtime.trap("Student not found");
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
      case (?u) u;
      case null Runtime.trap("Student not found");
    };
    
    results.values().toArray().filter(func(r) { r.studentId == student.id });
  };

  public query ({ caller }) func getPassageForGrade(grade : Nat) : async ?Passage {
    // This function should require authentication since it accesses educational content
    let _ = requireAuth(caller);
    
    let arr = passages.values().toArray().filter(func(p) { p.gradeLevel == grade });
    if (arr.size() > 0) ?arr[0] else null;
  };

  // ── Profile endpoints ──────────────────────────────────────────────────────────
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    switch (getCurrentUser(caller)) {
      case (null) null;
      case (?u) {
        let eff = getEffectiveLevel(u);
        ?{ userId = u.id; username = u.username; role = u.role;
           grade = u.grade; effectiveLevel = ?eff };
      };
    };
  };

  public query ({ caller }) func getUserProfile(userId : UserId) : async ?UserProfile {
    let cu = requireAuth(caller);
    if (cu.id != userId and cu.role != #admin) Runtime.trap("Unauthorized: Can only view your own profile or admin can view any");
    switch (users.get(userId)) {
      case (null) null;
      case (?u) {
        let eff = getEffectiveLevel(u);
        ?{ userId = u.id; username = u.username; role = u.role;
           grade = u.grade; effectiveLevel = ?eff };
      };
    };
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    let cu = requireAuth(caller);
    if (cu.id != profile.userId) Runtime.trap("Unauthorized: Can only save your own profile");
    switch (users.get(profile.userId)) {
      case (null) Runtime.trap("User not found");
      case (?u) {
        upsertUser(u.id, {
          id = u.id; username = profile.username; password = u.password;
          role = u.role; grade = u.grade; teacherId = u.teacherId;
        });
      };
    };
  };

  // ── Analytics stub (will be implemented with proper authorization) ────────────
  public query ({ caller }) func getWeeklyReport(studentId : UserId) : async Text {
    // Require authorization to access student data
    authorizeStudentAccess(caller, studentId);
    Runtime.trap("Not implemented yet, will be added in upcoming version");
  };

  // ── Compatibility stubs ────────────────────────────────────────────────────────
  public shared func initializeSystem()    : async () {};
  public shared func ensureClassio1Admin() : async () {};
};

