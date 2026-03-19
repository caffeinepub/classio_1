export interface PracticeQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export type GradePracticeQuestions = Record<number, PracticeQuestion[]>;

// Questions are tied to the first passage per grade (index 0)
// Grade 1: "The Helpful Dog"
// Grade 2: "The Lost Kite"
// Grade 3: "The Old Lighthouse"
// Grade 4: "The Night Shift"
// Grade 5: "The New Student"
// Grade 6: "The Chess Champion"
// Grade 7: "The Apprentice"
// Grade 8: "The Poet's Gift"
// Grade 9: "The Unfinished Map"
// Grade 10: "The Weight of Words"

const practiceQuestions: GradePracticeQuestions = {
  // Grade 1 — "The Helpful Dog"
  1: [
    {
      question: "What was the dog's name in the story?",
      options: ["Rex", "Max", "Buddy", "Jack"],
      correctIndex: 1,
      explanation: "The dog's name was Max, a big brown dog belonging to Sam.",
    },
    {
      question: "What did Sam give Max every morning?",
      options: [
        "A ball and a toy",
        "A bowl of water and a bone",
        "Some bread and milk",
        "A treat and a hug",
      ],
      correctIndex: 1,
      explanation: "Sam gave Max a bowl of water and a bone every morning.",
    },
    {
      question: "What did Max do when Sam dropped his bag?",
      options: [
        "He barked loudly",
        "He ran away",
        "He picked it up and brought it back",
        "He sat and waited",
      ],
      correctIndex: 2,
      explanation:
        "Max picked up the bag in his mouth and brought it back to Sam.",
    },
    {
      question: "How did Sam feel when Max returned his bag?",
      options: ["Angry", "Surprised", "Sad", "Happy"],
      correctIndex: 3,
      explanation:
        "Sam smiled and gave Max a big hug, showing he was very happy.",
    },
    {
      question: "What did Sam give Max at the end of the day?",
      options: ["A new toy", "An extra treat", "A bath", "A longer walk"],
      correctIndex: 1,
      explanation:
        "Sam agreed with his mother and gave Max an extra treat that evening.",
    },
  ],

  // Grade 2 — "The Lost Kite"
  2: [
    {
      question: "What colour was Priya's kite?",
      options: ["Red", "Green", "Blue", "Yellow"],
      correctIndex: 2,
      explanation: "Priya flew her blue kite in the park on a windy afternoon.",
    },
    {
      question: "Why did the kite fly away?",
      options: [
        "The wind was too strong",
        "The string snapped",
        "Priya let go of it",
        "It was too light",
      ],
      correctIndex: 1,
      explanation:
        "Suddenly the string snapped and the kite flew away over the trees.",
    },
    {
      question: "Where was the kite found?",
      options: [
        "On the grass",
        "In the pond",
        "Caught between branches of an oak tree",
        "On the roof of a building",
      ],
      correctIndex: 2,
      explanation:
        "The old man pointed to a tall oak tree where the kite was caught between two branches.",
    },
    {
      question: "How was the kite brought down?",
      options: [
        "Priya climbed the tree",
        "A park worker climbed a ladder",
        "The wind blew it down",
        "The old man shook the tree",
      ],
      correctIndex: 1,
      explanation:
        "The old man called a park worker, who climbed a ladder and brought the kite down.",
    },
    {
      question: "What did Priya's mother do to repair the kite?",
      options: [
        "Bought a new kite",
        "Used sticky tape",
        "Sewed the tail back with bright yellow thread",
        "Tied the string back together",
      ],
      correctIndex: 2,
      explanation:
        "Her mother sewed the torn tail back with bright yellow thread.",
    },
  ],

  // Grade 3 — "The Old Lighthouse"
  3: [
    {
      question: "What was the lighthouse keeper's name?",
      options: ["Mr. Singh", "Mr. Hasan", "Mr. Shore", "Mr. Voss"],
      correctIndex: 1,
      explanation:
        "The lighthouse keeper was called Mr. Hasan, who climbed the stairs every evening.",
    },
    {
      question: "Why was the lighthouse important to sailors?",
      options: [
        "It provided shelter from storms",
        "It sold food and supplies",
        "Its beams of light showed where the rocks were",
        "It broadcast weather forecasts",
      ],
      correctIndex: 2,
      explanation:
        "Sailors watched for the flash of light to know where the dangerous rocks were.",
    },
    {
      question: "What happened on the stormy night described in the passage?",
      options: [
        "A ship crashed on the rocks",
        "Mr. Hasan called for help",
        "The electricity went out and he lit the oil lamp by hand",
        "The lighthouse was damaged",
      ],
      correctIndex: 2,
      explanation:
        "The electricity went out, so Mr. Hasan quickly lit the old oil lamp by hand, just as keepers had done long ago.",
    },
    {
      question: "For how many years had Mr. Hasan kept records in his logbook?",
      options: ["Ten years", "Twenty years", "Forty years", "A hundred years"],
      correctIndex: 2,
      explanation:
        "His logbook recorded every storm and every ship for forty years.",
    },
    {
      question: "What did Mr. Hasan believe about his job?",
      options: [
        "It was lonely and difficult",
        "It was the most important job in the world",
        "It would soon become unnecessary",
        "It was easy work for little reward",
      ],
      correctIndex: 1,
      explanation:
        "Mr. Hasan always said that keeping the light burning was the most important job in the world.",
    },
  ],

  // Grade 4 — "The Night Shift"
  4: [
    {
      question: "What is the main idea of the passage?",
      options: [
        "Night shifts are dangerous and should be avoided",
        "Workers on the night shift keep the city running while others sleep",
        "Bakers and nurses are the most important workers",
        "Cities would be better without night workers",
      ],
      correctIndex: 1,
      explanation:
        "The passage describes the many workers who keep the city running through the night while most people sleep.",
    },
    {
      question:
        "What do bakers do at three in the morning, according to the passage?",
      options: [
        "Sleep before the early morning rush",
        "Deliver bread to shops",
        "Knead dough so loaves are ready when shops open",
        "Clean the bakery for the day shift",
      ],
      correctIndex: 2,
      explanation:
        "Bakers knead dough at three in the morning so that the loaves are ready when the shops open.",
    },
    {
      question:
        "Why does the author say the night workers' contribution is 'invisible'?",
      options: [
        "They work in the dark",
        "Their work is done before most people are awake to see it",
        "They are not paid for their work",
        "They prefer not to be noticed",
      ],
      correctIndex: 1,
      explanation:
        "Their contribution is invisible because the work is completed before most people wake up, so it is rarely noticed.",
    },
    {
      question:
        "Which of the following is NOT mentioned as a night shift worker in the passage?",
      options: [
        "Security guards",
        "Signal engineers",
        "Schoolteachers",
        "Street cleaners",
      ],
      correctIndex: 2,
      explanation:
        "The passage does not mention schoolteachers as night workers; it lists street cleaners, bakers, nurses, security guards, delivery drivers, signal engineers, and others.",
    },
    {
      question:
        "What does the author suggest the reader should do at the end of the passage?",
      options: [
        "Apply for a night shift job",
        "Avoid eating fresh bread",
        "Remember the workers who made ordinary life possible",
        "Stop reading the morning newspaper",
      ],
      correctIndex: 2,
      explanation:
        "The author tells the reader to remember the hands that made fresh bread and the morning news possible.",
    },
  ],

  // Grade 5 — "The New Student"
  5: [
    {
      question: "Why had Daniel moved to the new school?",
      options: [
        "He had been expelled from his old school",
        "His family moved from another country over the summer",
        "He wanted to be closer to the library",
        "He had won a scholarship",
      ],
      correctIndex: 1,
      explanation:
        "Daniel had moved from another country over the summer and was the new student in Class 7B.",
    },
    {
      question: "How did Aisha first start a conversation with Daniel?",
      options: [
        "She offered to share her lunch with him",
        "She asked him about the book he was reading",
        "She introduced herself and asked where he was from",
        "She asked him to join her group project",
      ],
      correctIndex: 1,
      explanation:
        "Aisha noticed he was reading a novel she had finished and sat down to ask what he thought of the ending.",
    },
    {
      question:
        "What was Daniel's opinion of the ending of the novel he was reading?",
      options: [
        "He loved it and wished there was a sequel",
        "He found it too sad",
        "He thought it was too easy and the author should have let the reader decide",
        "He hadn't finished it yet",
      ],
      correctIndex: 2,
      explanation:
        "Daniel said the ending was too easy and the author should have let the reader decide.",
    },
    {
      question: "What changed for Daniel by Friday?",
      options: [
        "He had become the top student in the class",
        "He was sitting with Aisha and her friends at lunch",
        "He had been chosen as class representative",
        "He had started speaking more in lessons",
      ],
      correctIndex: 1,
      explanation:
        "By Friday, Daniel was sitting with Aisha and her friends, showing he was no longer eating alone.",
    },
    {
      question: "What did Aisha say about what she had done to help Daniel?",
      options: [
        "She had planned it carefully to make him feel welcome",
        "She had done nothing special — she simply noticed someone and asked a question",
        "She had told the teacher Daniel was struggling",
        "She had organised a welcome event for him",
      ],
      correctIndex: 1,
      explanation:
        "Aisha later said she hadn't done anything special — she had simply noticed someone and asked a question.",
    },
  ],

  // Grade 6 — "The Chess Champion"
  6: [
    {
      question: "What made Leila's chess victory unusual?",
      options: [
        "She had only learned the game that year",
        "She was the youngest winner ever and had prepared differently from other competitors",
        "She won without ever losing a single match",
        "She played using an entirely new set of rules",
      ],
      correctIndex: 1,
      explanation:
        "Her victory was unusual because of her age and because she prepared differently, spending most practice time playing her grandfather rather than studying standard games.",
    },
    {
      question:
        "What skill did playing against her grandfather develop in Leila?",
      options: [
        "The ability to memorise famous games",
        "A talent for speed chess",
        "An instinct for improvisation",
        "Expertise in opening sequences",
      ],
      correctIndex: 2,
      explanation:
        "Because her grandfather's rules were slightly different, Leila never knew what to expect and developed an instinct for improvisation.",
    },
    {
      question:
        "What lesson had Leila's grandfather taught her about patience?",
      options: [
        "Patience means waiting for your opponent to make a mistake",
        "Patience is passive and calming",
        "Patience is a form of pressure, applied slowly and without announcement",
        "Patience means studying longer than anyone else",
      ],
      correctIndex: 2,
      explanation:
        "Her grandfather taught her that patience was not passive; it was a form of pressure, applied slowly and without announcement.",
    },
    {
      question: "How did Leila's opponent behave in the final round?",
      options: [
        "He played cautiously and defensively from the start",
        "He played a confident opening, expecting a predictable response",
        "He tried to make the game last as long as possible",
        "He copied Leila's style of play",
      ],
      correctIndex: 1,
      explanation:
        "He played a confident opening, expecting her to follow a predictable response — but she did not.",
    },
    {
      question: "What did Leila do after winning the championship?",
      options: [
        "She gave a speech at the ceremony",
        "She agreed to be interviewed by a journalist",
        "She went home, had dinner, and played three more games with her grandfather",
        "She studied the match and wrote down what she had learned",
      ],
      correctIndex: 2,
      explanation:
        "Leila went home, ate dinner with her family, and played three more games with her grandfather that evening.",
    },
  ],

  // Grade 7 — "The Apprentice"
  7: [
    {
      question: "Where was Mr. Voss's workshop located?",
      options: [
        "In a large shopping street",
        "At the end of a narrow lane in the old quarter of the city",
        "Above a library in the city centre",
        "Near the train station",
      ],
      correctIndex: 1,
      explanation:
        "The workshop sat at the end of a narrow lane in the old quarter of the city.",
    },
    {
      question:
        "What was Jamal allowed to do during the first three months of his apprenticeship?",
      options: [
        "Repair simple clocks under supervision",
        "Only watch and perform cleaning tasks",
        "Design new clock components",
        "Serve customers at the front of the shop",
      ],
      correctIndex: 1,
      explanation:
        "In the beginning, Jamal was allowed only to watch and clean — polishing lenses, sweeping filings, and arranging tools.",
    },
    {
      question: "How did Mr. Voss communicate disapproval to Jamal?",
      options: [
        "By raising his voice sharply",
        "By writing notes and leaving them on the bench",
        "With a single look that would last all day",
        "By assigning extra cleaning tasks",
      ],
      correctIndex: 2,
      explanation:
        "Mr. Voss never raised his voice, but a single look from him was sufficient to communicate disapproval that would last all day.",
    },
    {
      question:
        "How long did Jamal work on the bracket clock before presenting it to Mr. Voss?",
      options: ["One afternoon", "One full day", "Two full days", "Three days"],
      correctIndex: 2,
      explanation:
        "Jamal worked on the bracket clock for two full days, disassembling, cleaning, and reassembling each component.",
    },
    {
      question:
        "What did Jamal do when he opened his own workshop seven years later?",
      options: [
        "He named it after Mr. Voss",
        "He hung a photograph of Mr. Voss above the door",
        "He wrote a book about his apprenticeship",
        "He invited Mr. Voss to be his partner",
      ],
      correctIndex: 1,
      explanation:
        "He opened his own workshop seven years later and hung a photograph of Mr. Voss above the door.",
    },
  ],

  // Grade 8 — "The Poet's Gift"
  8: [
    {
      question:
        "How long had Yasmin Khalil's manuscript sat in a drawer before publication?",
      options: ["Four years", "Seven years", "Eleven years", "Twenty years"],
      correctIndex: 2,
      explanation:
        "The manuscript had sat in a drawer for eleven years before a friend discovered it and sent it to publishers.",
    },
    {
      question: "How did the manuscript come to be discovered?",
      options: [
        "Yasmin submitted it to a competition",
        "A friend found it while clearing a storage room and sent it to publishers without asking",
        "A publisher approached Yasmin at a literary event",
        "Yasmin's daughter found it and encouraged her to publish",
      ],
      correctIndex: 1,
      explanation:
        "A friend who was clearing out a storage room discovered it and, without asking permission, sent it to three publishers.",
    },
    {
      question: "Why did Yasmin feel ambivalent about publishing?",
      options: [
        "She feared the poems were not good enough",
        "She had written without an audience for so long that the prospect of one unsettled her",
        "She was worried about negative reviews",
        "She thought the poems were too personal to be understood by others",
      ],
      correctIndex: 1,
      explanation:
        "She had written without an audience for so long that the prospect of one unsettled her; the poems had been private conversations with herself.",
    },
    {
      question: "What condition did Yasmin set for publication?",
      options: [
        "The book must include a long introduction by a famous poet",
        "It must be published only in limited numbers",
        "No photograph of her and no biographical note beyond her name",
        "It could only be sold in her home city",
      ],
      correctIndex: 2,
      explanation:
        "She agreed to publish with the condition that the book contain no photograph of her and no biographical note beyond her name.",
    },
    {
      question:
        "What does the ending of the passage suggest about Yasmin's private writing?",
      options: [
        "She stopped writing after the book was published",
        "She shared her new poems widely after the book's success",
        "She continued writing privately, keeping those poems entirely separate from her published work",
        "She began a second collection immediately",
      ],
      correctIndex: 2,
      explanation:
        "She continued to write poems she did not show anyone, keeping them in the same drawer as before, as if the published book and the private archive were two entirely separate things.",
    },
  ],

  // Grade 9 — "The Unfinished Map"
  9: [
    {
      question: "What made Anselm Brauer's map of the valley extraordinary?",
      options: [
        "It was drawn entirely from memory without any measurements",
        "It depicted the valley in multiple layers, including human activity and seasonal patterns",
        "It was the only surviving map from that era",
        "It was the largest hand-drawn map ever produced",
      ],
      correctIndex: 1,
      explanation:
        "Beyond the physical terrain, Brauer had drawn additional layers showing human activity, seasonal patterns, and community gathering places.",
    },
    {
      question: "Why was the map annotated as 'unfinished' by Brauer himself?",
      options: [
        "He had not completed the measurements of the valley",
        "He ran out of materials before finishing",
        "He intended a fourth and fifth layer that were never begun",
        "The map was damaged in a flood",
      ],
      correctIndex: 2,
      explanation:
        "Brauer had intended a fourth and fifth layer, which were never begun, and he annotated it as unfinished.",
    },
    {
      question:
        "What divided scholars who studied the map after Brauer's death?",
      options: [
        "Whether the physical measurements were accurate",
        "Whether calling it 'unfinished' was meaningful, since all maps could be seen as incomplete",
        "Whether it should be published or kept private",
        "Who should inherit the original document",
      ],
      correctIndex: 1,
      explanation:
        "Scholars argued about what it meant to call it unfinished — some said all maps were necessarily unfinished, others said Brauer had a specific intention that was genuinely incomplete.",
    },
    {
      question: "What response did museum visitors have to the map?",
      options: [
        "They found it confusing and hard to interpret",
        "They often stood before it for longer than any other exhibit",
        "They were disappointed that it was unfinished",
        "They were most interested in the physical terrain layer",
      ],
      correctIndex: 1,
      explanation:
        "Visitors often stood before it for longer than they stood before any other exhibit.",
    },
    {
      question:
        "What did museum staff believe held visitors' attention at the map?",
      options: [
        "Its enormous physical size",
        "The bright colours used in each layer",
        "The map seemed to be asking something rather than telling it",
        "The story of how it was discovered",
      ],
      correctIndex: 2,
      explanation:
        "The consensus among museum staff was that the map seemed to be asking something rather than telling it.",
    },
  ],

  // Grade 10 — "The Weight of Words"
  10: [
    {
      question:
        "What did Adaeze Nwosu consider insufficient about the standard explanation of how words have meaning?",
      options: [
        "It was too technically complex for ordinary readers",
        "It described the mechanism of meaning without explaining what was at stake when it worked or failed",
        "It ignored the role of grammar in shaping meaning",
        "It was based on outdated research",
      ],
      correctIndex: 1,
      explanation:
        "Nwosu found the standard answer accurate but insufficient — it described the mechanism without explaining what was at stake.",
    },
    {
      question:
        "What was the central argument Nwosu developed across her three books?",
      options: [
        "That words are purely social conventions with no fixed meaning",
        "That meaning is always a function of the speaker's relationship to the world they describe, not just a property of language as a system",
        "That translation between languages is fundamentally impossible",
        "That grammar rules determine meaning more than vocabulary",
      ],
      correctIndex: 1,
      explanation:
        "Her central argument was that meaning was never simply a property of language as a system but always partly a function of the relationship between the speaker and the world they were attempting to describe.",
    },
    {
      question:
        "What does Nwosu mean by the 'implicit commitment' carried by the act of naming?",
      options: [
        "A promise to use words consistently across all contexts",
        "A legal obligation to accuracy in formal writing",
        "A responsibility to the thing named that most linguistic theory had chosen not to examine",
        "An agreement between speakers about shared definitions",
      ],
      correctIndex: 2,
      explanation:
        "She claimed that the act of naming carried a responsibility to the thing named — something most linguistic theory had chosen not to examine.",
    },
    {
      question:
        "What does Nwosu argue about the best testimony from survivors of atrocity?",
      options: [
        "It achieves clarity by using very simple language",
        "It does not resolve the failure of language but makes that failure visible",
        "It relies on metaphor to compensate for the limits of literal description",
        "It avoids the problem by refusing to use conventional vocabulary",
      ],
      correctIndex: 1,
      explanation:
        "The best such testimony did not resolve the problem of language's inadequacy; it made the problem visible.",
    },
    {
      question:
        "Which fields beyond philosophy were influenced by Nwosu's work?",
      options: [
        "Economics and political science",
        "Writers, historians, and legal scholars concerned with trauma testimony",
        "Neuroscientists and psychologists",
        "Translators and language teachers",
      ],
      correctIndex: 1,
      explanation:
        "Nwosu's work influenced writers, historians, and legal scholars concerned with how courts handled the language of trauma.",
    },
  ],
};

export default practiceQuestions;
