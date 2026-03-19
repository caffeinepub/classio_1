export interface MCQ {
  question: string;
  options: string[];
  correctIndex: number;
}

export const PASSAGE_MCQS: Record<number, MCQ[]> = {
  // Grade 1 - Passage 1: The Helpful Dog
  1: [
    {
      question: "What was the dog's name in the story?",
      options: ["Rex", "Max", "Buddy", "Sam"],
      correctIndex: 1,
    },
    {
      question: "What did Max do when Sam dropped his bag?",
      options: [
        "He barked loudly",
        "He ran away from it",
        "He picked it up and brought it back",
        "He sat and waited",
      ],
      correctIndex: 2,
    },
    {
      question: "What did Sam give Max every morning?",
      options: [
        "A ball and a toy",
        "A bowl of water and a bone",
        "Some bread and milk",
        "A warm blanket",
      ],
      correctIndex: 1,
    },
    {
      question: "What did Max do after Sam gave him a big hug?",
      options: [
        "He ran into the house",
        "He fell asleep",
        "He barked and walked away",
        "He licked Sam's face and barked happily",
      ],
      correctIndex: 3,
    },
    {
      question: "What did Sam give Max as a reward at the end?",
      options: [
        "A new ball",
        "A bowl of water",
        "An extra treat",
        "A long walk",
      ],
      correctIndex: 2,
    },
  ],

  // Grade 1 - Passage 2: A Rainy Day
  2: [
    {
      question: "What colour was Lily's raincoat?",
      options: ["Blue", "Green", "Red", "Yellow"],
      correctIndex: 3,
    },
    {
      question: "What did Lily and her brother do in the rain?",
      options: [
        "They stayed inside and read",
        "They held hands and danced in the rain",
        "They watched television",
        "They built a shelter",
      ],
      correctIndex: 1,
    },
    {
      question: "What did Mother call them inside for?",
      options: ["Hot chocolate", "Warm soup", "A dry towel", "Some toast"],
      correctIndex: 1,
    },
    {
      question: "What did the little bird do on the fence?",
      options: [
        "It sang a song",
        "It flew away quickly",
        "It shook the water from its wings",
        "It pecked at the ground",
      ],
      correctIndex: 2,
    },
    {
      question: "What appeared in the sky when the rain stopped?",
      options: ["Stars", "A rainbow", "Dark clouds", "The moon"],
      correctIndex: 1,
    },
  ],

  // Grade 1 - Passage 3: The Kind Boy
  3: [
    {
      question: "What did Tom bring to school in his bag?",
      options: ["A red apple", "A sandwich", "A book", "An orange"],
      correctIndex: 0,
    },
    {
      question: "Why did Tom feel sorry for Miss Green?",
      options: [
        "She was very tired",
        "She had a sore throat",
        "She had lost her book",
        "She was sad",
      ],
      correctIndex: 1,
    },
    {
      question: "What did Tom do with the apple?",
      options: [
        "He ate it at break time",
        "He gave it to Miss Green",
        "He shared it with Sara",
        "He put it back in his bag",
      ],
      correctIndex: 1,
    },
    {
      question: "What did Sara do when she noticed Tom had no fruit?",
      options: [
        "She gave him a biscuit",
        "She bought him an apple",
        "She gave him half her orange",
        "She told the teacher",
      ],
      correctIndex: 2,
    },
    {
      question: "What lesson did Tom learn at the end of the story?",
      options: [
        "Always bring extra food",
        "Teachers need more rest",
        "Kindness always comes back to you",
        "Sharing is sometimes difficult",
      ],
      correctIndex: 2,
    },
  ],

  // Grade 2 - Passage 4: The Lost Kite
  4: [
    {
      question: "What colour was Priya's kite?",
      options: ["Red", "Green", "Yellow", "Blue"],
      correctIndex: 3,
    },
    {
      question: "Where was the kite found?",
      options: [
        "On the roof of a house",
        "Caught between branches of a tall oak tree",
        "Floating in the pond",
        "Tangled in a fence",
      ],
      correctIndex: 1,
    },
    {
      question: "Who helped bring the kite down?",
      options: [
        "Priya's mother",
        "A park worker with a ladder",
        "A group of children",
        "The old man climbed the tree",
      ],
      correctIndex: 1,
    },
    {
      question: "What happened to the kite's tail?",
      options: [
        "It was completely destroyed",
        "It was missing",
        "It was a little torn",
        "It was wet and dirty",
      ],
      correctIndex: 2,
    },
    {
      question:
        "What did Priya do differently the next time she flew the kite?",
      options: [
        "She flew it in a different park",
        "She asked her mother to watch",
        "She held the string very tightly",
        "She tied the string to a post",
      ],
      correctIndex: 2,
    },
  ],

  // Grade 2 - Passage 5: A Day at the Market
  5: [
    {
      question: "When did Grandma take Ravi to the market?",
      options: [
        "Every Sunday",
        "Every Saturday",
        "Every Friday",
        "Every Monday",
      ],
      correctIndex: 1,
    },
    {
      question: "What did Ravi pick from the fruit stall?",
      options: [
        "Mangoes and oranges",
        "Two bananas and a bunch of grapes",
        "Watermelons and berries",
        "Apples and pears",
      ],
      correctIndex: 1,
    },
    {
      question:
        "What did the vegetable seller always give Grandma as an extra?",
      options: [
        "An extra onion",
        "An extra tomato",
        "A free bunch of herbs",
        "A discount",
      ],
      correctIndex: 1,
    },
    {
      question: "Where did Grandma and Ravi eat their sweets?",
      options: [
        "On the way home in the street",
        "At the fruit stall",
        "On a bench near the fountain",
        "At home in the kitchen",
      ],
      correctIndex: 2,
    },
    {
      question: "What did Grandma tell Ravi about the market?",
      options: [
        "She had opened it herself",
        "She had visited it since she was a little girl",
        "It was the biggest market in the country",
        "It only opened in summer",
      ],
      correctIndex: 1,
    },
  ],

  // Grade 2 - Passage 6: Maya's Garden
  6: [
    {
      question: "When did Maya plant seeds in her garden?",
      options: ["Every autumn", "Every winter", "Every spring", "Every summer"],
      correctIndex: 2,
    },
    {
      question: "How long did it take before tiny green shoots appeared?",
      options: ["One day", "One week", "One month", "Two weeks"],
      correctIndex: 1,
    },
    {
      question: "Why did Maya put a small fence around her plants?",
      options: [
        "To keep the wind away",
        "To keep rabbits away",
        "To mark where the seeds were",
        "To hold up the tall plants",
      ],
      correctIndex: 1,
    },
    {
      question: "What did Maya pick from the garden for her mother's birthday?",
      options: [
        "Vegetables",
        "A bunch of flowers",
        "Fresh herbs",
        "Ripe fruit",
      ],
      correctIndex: 1,
    },
    {
      question: "What did Maya's mother do with the flowers?",
      options: [
        "She gave them to a neighbour",
        "She dried them and kept them",
        "She placed them in a vase on the table",
        "She planted them in the garden",
      ],
      correctIndex: 2,
    },
  ],

  // Grade 3 - Passage 7: The Old Lighthouse
  7: [
    {
      question: "What was the lighthouse keeper's name?",
      options: ["Mr. Ahmed", "Mr. Hasan", "Mr. Hassan", "Mr. Harris"],
      correctIndex: 1,
    },
    {
      question: "Why did sailors watch for the lighthouse's flash?",
      options: [
        "To know the time of day",
        "To check the weather",
        "To know where the rocks were",
        "To find the nearest port",
      ],
      correctIndex: 2,
    },
    {
      question: "What happened one stormy night at the lighthouse?",
      options: [
        "A ship crashed on the rocks",
        "Mr. Hasan was not there",
        "The electricity went out and the lamp stopped turning",
        "The lighthouse was damaged by the storm",
      ],
      correctIndex: 2,
    },
    {
      question: "How long had Mr. Hasan been keeping the logbook?",
      options: ["Twenty years", "Thirty years", "Forty years", "Fifty years"],
      correctIndex: 2,
    },
    {
      question:
        "What did Mr. Hasan always say about keeping the light burning?",
      options: [
        "It was a lonely job",
        "It was the most important job in the world",
        "It was difficult but rewarding",
        "It was his favourite thing to do",
      ],
      correctIndex: 1,
    },
  ],

  // Grade 3 - Passage 8: A Letter to a Friend
  8: [
    {
      question: "Why had Amara moved to a new city?",
      options: [
        "Her family wanted a change",
        "She moved at the start of the school year",
        "She went to visit relatives",
        "The passage does not explain why",
      ],
      correctIndex: 3,
    },
    {
      question: "What did Amara include in the envelope besides her letter?",
      options: [
        "A pressed flower",
        "A photograph",
        "A little sketch of the grey cat",
        "A piece of ribbon",
      ],
      correctIndex: 2,
    },
    {
      question: "What was Amara's new teacher known for?",
      options: [
        "Being very strict",
        "Telling funny jokes and letting the class read freely on Fridays",
        "Assigning lots of homework",
        "Organising school trips",
      ],
      correctIndex: 1,
    },
    {
      question: "How long did it take for a reply to arrive?",
      options: ["One week", "Two weeks", "Three weeks", "One month"],
      correctIndex: 1,
    },
    {
      question: "What did Amara do with Lily's reply?",
      options: [
        "She wrote back immediately",
        "She read it once and put it away",
        "She read it twice and kept it in a tin box under her bed",
        "She shared it with her parents",
      ],
      correctIndex: 2,
    },
  ],

  // Grade 3 - Passage 9: The Street Musician
  9: [
    {
      question: "When did the old man play the violin in the town square?",
      options: [
        "Every morning",
        "Every Sunday afternoon",
        "Every Friday evening",
        "Every Saturday",
      ],
      correctIndex: 2,
    },
    {
      question: "How did people react as they passed the musician?",
      options: [
        "They all stopped and watched immediately",
        "They hurried past without listening",
        "Many of them slowed their steps without realising it",
        "They formed a queue to hear him",
      ],
      correctIndex: 2,
    },
    {
      question:
        "What did the old man say his teacher had told him about music?",
      options: [
        "Music is the hardest skill to learn",
        "Music is a gift you give away so that it grows bigger",
        "Music is most beautiful when played alone",
        "Music should only be played in concert halls",
      ],
      correctIndex: 1,
    },
    {
      question: "What did the young girl ask the old man?",
      options: [
        "Where he bought his violin",
        "How much he earned",
        "Where he had learned to play",
        "What the songs were called",
      ],
      correctIndex: 2,
    },
    {
      question: "What did the girl's parents buy her after she went home?",
      options: ["A piano", "A flute", "A guitar", "A small second-hand violin"],
      correctIndex: 3,
    },
  ],

  // Grade 4 - Passage 10: The Night Shift
  10: [
    {
      question: "What do street cleaners do before dawn?",
      options: [
        "They deliver newspapers",
        "They push wide brushes along the pavements",
        "They collect rubbish from houses",
        "They repair the roads",
      ],
      correctIndex: 1,
    },
    {
      question: "At what time do bakers typically start kneading dough?",
      options: [
        "Midnight",
        "Two in the morning",
        "Three in the morning",
        "Five in the morning",
      ],
      correctIndex: 2,
    },
    {
      question: "Why do signal engineers test railway lines at night?",
      options: [
        "The equipment works better in the dark",
        "They prefer to work at night",
        "The tracks are empty and still at that time",
        "Night testing is required by law",
      ],
      correctIndex: 2,
    },
    {
      question:
        "According to the passage, what would happen without night shift workers?",
      options: [
        "Cities would be noisier during the day",
        "Ordinary life would quickly fall apart",
        "Daytime workers would have more to do",
        "Public transport would improve",
      ],
      correctIndex: 1,
    },
    {
      question: "What does the passage encourage readers to remember?",
      options: [
        "To sleep early every night",
        "The hands that made their morning bread and newspaper possible",
        "To thank every worker they meet",
        "That night-time is the busiest time of day",
      ],
      correctIndex: 1,
    },
  ],

  // Grade 4 - Passage 11: A Young Painter
  11: [
    {
      question: "How old was Zara when she found the watercolour paints?",
      options: ["Seven", "Eight", "Nine", "Ten"],
      correctIndex: 2,
    },
    {
      question: "What was the subject of Zara's first painting?",
      options: [
        "Her family in the garden",
        "A narrow lane, a red post box, and a cat on a wall",
        "Birds flying over the city",
        "The inside of her grandmother's house",
      ],
      correctIndex: 1,
    },
    {
      question: "What did her parents notice about Zara?",
      options: [
        "She was very fast at painting",
        "She liked to copy other artists",
        "She observed everything around her with unusual attention",
        "She painted best in the mornings",
      ],
      correctIndex: 2,
    },
    {
      question: "What was the prize Zara received in the competition?",
      options: [
        "A certificate and medal",
        "A set of professional oil paints and a place at a summer art class",
        "A trip to an art museum",
        "A large cash award",
      ],
      correctIndex: 1,
    },
    {
      question: "What did Zara do after reading the prize letter?",
      options: [
        "She called her art teacher immediately",
        "She showed her parents the letter",
        "She went to her room and began to paint",
        "She went to the art shop to spend her prize",
      ],
      correctIndex: 2,
    },
  ],

  // Grade 4 - Passage 12: The Forest Trail
  12: [
    {
      question: "How long did the forest trail take to walk return?",
      options: ["One hour", "Two hours", "Three hours", "Half a day"],
      correctIndex: 1,
    },
    {
      question:
        "What did walkers often do at the flat boulder in the clearing?",
      options: [
        "They lit fires and camped there",
        "They stopped to rest and eat packed lunches",
        "They left messages for other walkers",
        "They climbed it to see the view",
      ],
      correctIndex: 1,
    },
    {
      question: "What did children do at the shallow stream?",
      options: [
        "They swam in the cool water",
        "They built small dams",
        "They caught tadpoles in jars",
        "They threw stones to make ripples",
      ],
      correctIndex: 2,
    },
    {
      question:
        "What effect did the forest trail have on people who did not talk in the street?",
      options: [
        "They still avoided each other on the trail",
        "They found themselves talking easily on the trail",
        "They competed to walk the fastest",
        "They chose different routes to avoid meeting",
      ],
      correctIndex: 1,
    },
    {
      question: "Why was the old wooden bridge easy to recognise?",
      options: [
        "It was the only bridge in the forest",
        "It had been painted bright red",
        "No two planks were the same colour",
        "It had a carved sign above it",
      ],
      correctIndex: 2,
    },
  ],

  // Grade 5 - Passage 13: The New Student
  13: [
    {
      question: "Why was Daniel sitting alone at lunch?",
      options: [
        "He preferred to eat alone",
        "He had been told to sit separately",
        "Most students were unsure how to begin talking to him",
        "He arrived late and there were no other seats",
      ],
      correctIndex: 2,
    },
    {
      question: "What made Aisha approach Daniel?",
      options: [
        "She wanted to welcome all new students",
        "Her teacher asked her to",
        "She noticed he was reading a novel she had finished the previous month",
        "They had met before at another school",
      ],
      correctIndex: 2,
    },
    {
      question: "What did Daniel say about the novel's ending?",
      options: [
        "It was perfect",
        "It was too sad",
        "It was too easy and the author should have let the reader decide",
        "It was confusing",
      ],
      correctIndex: 2,
    },
    {
      question: "What did Aisha later say she had done to help Daniel?",
      options: [
        "She had introduced him to all her friends",
        "She had helped him with his schoolwork",
        "She had not done anything special — just noticed someone and asked a question",
        "She had spoken to the teacher on his behalf",
      ],
      correctIndex: 2,
    },
    {
      question: "By Friday, where was Daniel sitting at lunchtime?",
      options: [
        "Still alone by the window",
        "With the teachers",
        "With Aisha and her friends",
        "In the library",
      ],
      correctIndex: 2,
    },
  ],

  // Grade 5 - Passage 14: Grandmother's Stories
  14: [
    {
      question: "What was unusual about Grandmother's stories?",
      options: [
        "They were always very short",
        "They were never the same twice, even about the same events",
        "They were always about famous people",
        "She only told them on special occasions",
      ],
      correctIndex: 1,
    },
    {
      question:
        "What was the one part of each story Grandmother was not allowed to change?",
      options: [
        "The names of the characters",
        "The setting of the story",
        "The lesson at the end",
        "How the story began",
      ],
      correctIndex: 2,
    },
    {
      question: "What did Neha begin doing to remember the stories?",
      options: [
        "She recorded them on a device",
        "She drew pictures of them",
        "She wrote them down in a notebook",
        "She retold them to friends at school",
      ],
      correctIndex: 2,
    },
    {
      question: "What did Grandmother say a story truly needed to come alive?",
      options: [
        "To be written down carefully",
        "Someone willing to give it their voice",
        "A large and attentive audience",
        "Beautiful language and detail",
      ],
      correctIndex: 1,
    },
    {
      question: "What did Neha do for the first time that night?",
      options: [
        "She wrote a story of her own",
        "She told one of Grandmother's stories back to her",
        "She recorded Grandmother telling a story",
        "She asked Grandmother to write the stories herself",
      ],
      correctIndex: 1,
    },
  ],

  // Grade 5 - Passage 15: The Village Baker
  15: [
    {
      question: "How many years had Mr. Ferreira run the bakery?",
      options: [
        "Twenty years",
        "Twenty-five years",
        "Thirty-one years",
        "Forty years",
      ],
      correctIndex: 2,
    },
    {
      question:
        "At what time did Mr. Ferreira arrive at the bakery every morning?",
      options: ["Two o'clock", "Three o'clock", "Four o'clock", "Five o'clock"],
      correctIndex: 2,
    },
    {
      question: "What did Mr. Ferreira say about the bakery?",
      options: [
        "It was his life's greatest achievement",
        "It was not his business — it was the street's bakery",
        "It was the best bakery in the region",
        "He planned to pass it on to his children",
      ],
      correctIndex: 1,
    },
    {
      question:
        "What did the neighbours do on Mr. Ferreira's thirtieth anniversary?",
      options: [
        "They gave him a large sum of money",
        "They organised a surprise, hung a banner, and filled the shop with people",
        "They published a story about him in the newspaper",
        "They sent him flowers and cards",
      ],
      correctIndex: 1,
    },
    {
      question: "What did Mr. Ferreira say he hoped at the end of the passage?",
      options: [
        "To retire and rest",
        "To open a second bakery",
        "To be there for another thirty years",
        "To pass the bakery to his son",
      ],
      correctIndex: 2,
    },
  ],

  // Grade 6 - Passage 16: The Chess Champion
  16: [
    {
      question: "What made Leila's preparation for chess unusual?",
      options: [
        "She hired a professional coach",
        "She studied opening sequences online",
        "She mostly played against her grandfather, who used slightly different rules",
        "She memorised every famous game ever played",
      ],
      correctIndex: 2,
    },
    {
      question: "What did her grandfather teach her about patience?",
      options: [
        "Patience meant waiting for the opponent to make a mistake",
        "Patience was passive and unhelpful in competition",
        "Patience was a form of pressure applied slowly and without announcement",
        "Patience was only useful in the endgame",
      ],
      correctIndex: 2,
    },
    {
      question: "How did Leila's opponent respond to her slow early moves?",
      options: [
        "He immediately changed his strategy",
        "He conceded defeat after five moves",
        "He waited twelve moves for her plan to reveal itself",
        "He challenged the referee",
      ],
      correctIndex: 2,
    },
    {
      question: "How many moves did it take Leila to win the final?",
      options: [
        "Fifteen moves",
        "Twenty moves",
        "Twenty-three moves",
        "Thirty moves",
      ],
      correctIndex: 2,
    },
    {
      question: "What happened that evening after the tournament?",
      options: [
        "Leila gave an interview to a journalist",
        "Leila played three more games with her grandfather — and lost all three",
        "Her grandfather taught her a new strategy",
        "Her family held a celebration dinner",
      ],
      correctIndex: 1,
    },
  ],

  // Grade 6 - Passage 17: A Journey by Train
  17: [
    {
      question: "At what time did the overnight train leave Platform 4?",
      options: [
        "Eight o'clock",
        "Nine o'clock",
        "Ten past nine",
        "Half past ten",
      ],
      correctIndex: 2,
    },
    {
      question:
        "What happened to the window when the train entered the long tunnel at midnight?",
      options: [
        "Clara could see the tunnel walls clearly",
        "The window turned completely black",
        "Her reflection disappeared",
        "The lights in the carriage went out",
      ],
      correctIndex: 1,
    },
    {
      question:
        "What was unusual about the small station the train passed through?",
      options: [
        "It was completely dark with no lights",
        "It was crowded with late-night travellers",
        "Snow was falling and no one boarded",
        "The train stopped there for a long time",
      ],
      correctIndex: 2,
    },
    {
      question:
        "What did Clara feel about arriving somewhere by train in the early morning?",
      options: [
        "It was exhausting and uncomfortable",
        "It gave a journey its proper weight — the place felt earned",
        "It made the destination seem less exciting",
        "It was the same as arriving by any other means",
      ],
      correctIndex: 1,
    },
    {
      question: "What was the man across the aisle doing on the train?",
      options: [
        "Listening to music with headphones",
        "Looking out of the window",
        "Reading a thick novel with a torn cover",
        "Writing in a notebook",
      ],
      correctIndex: 2,
    },
  ],

  // Grade 6 - Passage 18: The Lighthouse Keeper's Last Year
  18: [
    {
      question: "How many years had Agnes Shore worked as lighthouse keeper?",
      options: [
        "Ten years",
        "Fifteen years",
        "Nineteen years",
        "Twenty-five years",
      ],
      correctIndex: 2,
    },
    {
      question: "How was the lighthouse accessed?",
      options: [
        "By a bridge from the mainland",
        "By a supply boat that came once a fortnight",
        "By helicopter every week",
        "By a small motorboat available at all times",
      ],
      correctIndex: 1,
    },
    {
      question: "What did Agnes do before she left her post?",
      options: [
        "She trained her replacement",
        "She wrote a detailed record of everything she knew about the surrounding water",
        "She painted the lighthouse and repaired the lamp",
        "She gave a speech to the coastal authority",
      ],
      correctIndex: 1,
    },
    {
      question: "How did Agnes describe what she had written?",
      options: [
        "She said it was her life's work",
        "She said it was what the sea had taught her",
        "She said it was a warning for future keepers",
        "She said it was a scientific report",
      ],
      correctIndex: 1,
    },
    {
      question:
        "What did neighbours notice about Agnes after she moved to the mainland?",
      options: [
        "She rarely went outside",
        "She still watched the horizon every morning before breakfast",
        "She took up painting seascapes",
        "She wrote a book about her years at the lighthouse",
      ],
      correctIndex: 1,
    },
  ],

  // Grade 7 - Passage 19: The Apprentice
  19: [
    {
      question: "What was Mr. Voss's profession?",
      options: ["A watchmaker", "A clockmaker", "A jeweller", "An engineer"],
      correctIndex: 1,
    },
    {
      question: "What was Jamal only allowed to do for the first three months?",
      options: [
        "Watch, clean, and arrange tools",
        "Repair simple watches",
        "Study technical manuals",
        "Answer customer enquiries",
      ],
      correctIndex: 0,
    },
    {
      question:
        "What was the first task Mr. Voss gave Jamal to work on independently?",
      options: [
        "A broken pocket watch",
        "A damaged grandfather clock",
        "A broken bracket clock",
        "A small carriage clock",
      ],
      correctIndex: 2,
    },
    {
      question:
        "How did Mr. Voss respond when Jamal presented the repaired clock?",
      options: [
        "He praised Jamal in front of other workers",
        "He tested it, said nothing for a long time, then nodded once",
        "He immediately gave Jamal a more difficult task",
        "He told Jamal to repeat the repair more carefully",
      ],
      correctIndex: 1,
    },
    {
      question: "What did Jamal hang above the door of his own workshop?",
      options: [
        "A sign with his name on it",
        "A clock he had repaired himself",
        "A photograph of Mr. Voss",
        "A certificate from his apprenticeship",
      ],
      correctIndex: 2,
    },
  ],

  // Grade 7 - Passage 20: The Cartographer's Daughter
  20: [
    {
      question: "What was Sofia's father's profession?",
      options: [
        "A geography teacher",
        "A cartographer who made maps",
        "A historian",
        "A land surveyor",
      ],
      correctIndex: 1,
    },
    {
      question: "What did Sofia's father say a map always was?",
      options: [
        "A perfect record of the world",
        "A scientific measurement of land",
        "A decision and an argument about the world",
        "A guide for travellers",
      ],
      correctIndex: 2,
    },
    {
      question: "What subject did Sofia write her first important essay about?",
      options: [
        "The history of exploration",
        "How maps shaped the way people saw themselves and each other",
        "The science of measuring land",
        "Famous cartographers of the past",
      ],
      correctIndex: 1,
    },
    {
      question: "What did Sofia specialise in at university?",
      options: [
        "Physical geography and climate",
        "Urban planning",
        "The history of cartography",
        "Environmental science",
      ],
      correctIndex: 2,
    },
    {
      question: "What did Sofia's father say after her first public lecture?",
      options: [
        "He told her the lecture needed improvement",
        "He said she had understood the thing that mattered most",
        "He told her to continue her research further",
        "He suggested she write a book about it",
      ],
      correctIndex: 1,
    },
  ],

  // Grade 7 - Passage 21: Crossing the Gorge
  21: [
    {
      question: "How wide was the rope bridge across the Navar Gorge?",
      options: [
        "Wide enough for two people side by side",
        "Wide enough for one person at a time",
        "Wide enough for small carts",
        "Wide enough for three people abreast",
      ],
      correctIndex: 1,
    },
    {
      question: "How far was the nearest alternative crossing?",
      options: [
        "One hour",
        "Two hours",
        "A four-hour detour around the mountain",
        "Half a day's walk",
      ],
      correctIndex: 2,
    },
    {
      question:
        "How did the village elder cross the bridge at the opening ceremony?",
      options: [
        "She ran across quickly",
        "She crossed slowly while holding both rails",
        "She walked at a measured pace, not holding the rope rails, looking straight ahead",
        "She was carried across on a chair",
      ],
      correctIndex: 2,
    },
    {
      question: "How did the schoolteacher cross the bridge?",
      options: [
        "He ran across quickly to get it over with",
        "He gripped both rails and inched forward step by step",
        "He closed his eyes and walked steadily",
        "He refused to cross on the first day",
      ],
      correctIndex: 1,
    },
    {
      question:
        "By the day after crossing, how did the teacher cross the bridge?",
      options: [
        "He still needed to grip both rails",
        "He crossed more easily and the day after without holding the rails at all",
        "He still refused to cross it alone",
        "He found another route",
      ],
      correctIndex: 1,
    },
  ],

  // Grade 8 - Passage 22: The Poet's Gift
  22: [
    {
      question: "At what age did Yasmin Khalil publish her first collection?",
      options: ["Forty", "Fifty", "Sixty-two", "Seventy"],
      correctIndex: 2,
    },
    {
      question: "How did the manuscript come to be sent to publishers?",
      options: [
        "Yasmin submitted it herself after years of consideration",
        "A friend discovered it and sent it to three publishers without asking permission",
        "A literary agent found it at an exhibition",
        "A publisher contacted her after reading a poem in a journal",
      ],
      correctIndex: 1,
    },
    {
      question: "What condition did Yasmin attach to the book's publication?",
      options: [
        "It should be published in a limited edition only",
        "No photograph of her and no biographical note beyond her name",
        "It should only be sold in independent bookshops",
        "The price should be kept very low",
      ],
      correctIndex: 1,
    },
    {
      question: "What caused the book's sales to increase significantly?",
      options: [
        "Yasmin gave several radio interviews",
        "It was chosen as a school reading text",
        "A brief review in a literary journal used the word 'essential' three times",
        "A famous author recommended it publicly",
      ],
      correctIndex: 2,
    },
    {
      question: "What did Yasmin continue to do after the book was published?",
      options: [
        "She began writing a second collection immediately",
        "She went on a reading tour across the country",
        "She wrote poems she did not show anyone, keeping them in the same drawer",
        "She started a writing school for other poets",
      ],
      correctIndex: 2,
    },
  ],

  // Grade 8 - Passage 23: The Archive
  23: [
    {
      question: "What did the archive in the library basement contain?",
      options: [
        "Forty years of letters from library visitors",
        "Forty years of photographs taken by a single person",
        "The records of every book borrowed from the library",
        "Rare books donated by the public",
      ],
      correctIndex: 1,
    },
    {
      question: "What was the condition Miriam Osei attached to her donation?",
      options: [
        "It should never be exhibited publicly",
        "It should only be viewed by professional photographers",
        "It was not to be exhibited for twenty-five years",
        "It should be exhibited within five years of her death",
      ],
      correctIndex: 2,
    },
    {
      question: "What struck the archivists most about the photographs?",
      options: [
        "The technical perfection of each image",
        "The consistency of attention and quality of regard in each photograph",
        "The famous people who appeared in many of them",
        "The unusual cameras and techniques Miriam had used",
      ],
      correctIndex: 1,
    },
    {
      question:
        "Did the subjects of Miriam's photographs appear to know they were being photographed?",
      options: [
        "Yes, they had all signed consent forms",
        "Yes, they often posed for her",
        "No, they had been caught simply being themselves",
        "Only some of them were aware",
      ],
      correctIndex: 2,
    },
    {
      question: "Why did people come to the archive after it was opened?",
      options: [
        "To see the historic building in the basement",
        "To find themselves, their parents, or their past selves looking back",
        "To purchase prints of their favourite photographs",
        "To learn about the history of photography",
      ],
      correctIndex: 1,
    },
  ],

  // Grade 8 - Passage 24: The Translator
  24: [
    {
      question: "How many languages did Elena Vasquez speak professionally?",
      options: ["Three", "Four", "Five", "Six"],
      correctIndex: 2,
    },
    {
      question: "What did Elena say each language gave her?",
      options: [
        "Access to different careers",
        "A different self — a different facet of her identity",
        "A more accurate way of thinking",
        "A connection to a different culture",
      ],
      correctIndex: 1,
    },
    {
      question:
        "What did Elena regard as the most interesting thing about being alive?",
      options: [
        "That the world was not translatable without remainder",
        "That language could be learned at any age",
        "That every language had its own beauty",
        "That people connected through language across cultures",
      ],
      correctIndex: 0,
    },
    {
      question:
        "Why did Elena write her memoirs in her second language rather than her first?",
      options: [
        "Her first language had no word for many of her experiences",
        "Her publisher required it",
        "Writing in her first language would have felt too much like thinking out loud",
        "Her second language had more precise vocabulary",
      ],
      correctIndex: 2,
    },
    {
      question:
        "What did the necessary distance of her second language allow her to do?",
      options: [
        "Write with more precise technical language",
        "Observe her own life as if it belonged to someone slightly different",
        "Express emotions she could not name in her first language",
        "Reach a wider international audience",
      ],
      correctIndex: 1,
    },
  ],

  // Grade 9 - Passage 25: The Unfinished Map
  25: [
    {
      question: "How long had Anselm Brauer been drawing the map when he died?",
      options: ["Ten years", "Fifteen years", "Eighteen years", "Twenty years"],
      correctIndex: 2,
    },
    {
      question:
        "What made the map extraordinary beyond its physical precision?",
      options: [
        "Its enormous size and detailed colour",
        "Its layering of physical, human, and seasonal information",
        "The fact that it had been drawn entirely by hand",
        "The rare materials Brauer had used",
      ],
      correctIndex: 1,
    },
    {
      question: "How many layers did Brauer intend the map to have in total?",
      options: ["Three", "Four", "Five", "Six"],
      correctIndex: 2,
    },
    {
      question:
        "What divided scholars who studied the map after Brauer's death?",
      options: [
        "Whether the map was accurate enough to be useful",
        "Whether it was truly unfinished or intentionally incomplete",
        "Whether it should be publicly exhibited",
        "Whether Brauer had drawn it alone",
      ],
      correctIndex: 1,
    },
    {
      question: "What did museum staff feel the map was doing to visitors?",
      options: [
        "Telling them something about the valley's history",
        "Asking them something rather than telling them",
        "Showing them how maps had changed over time",
        "Inviting them to contribute information",
      ],
      correctIndex: 1,
    },
  ],

  // Grade 9 - Passage 26: The Silence Between Notes
  26: [
    {
      question:
        "What paradox had troubled Arjun Mehta since his student years?",
      options: [
        "That music needed an audience to be complete",
        "That silence was not the absence of music but one of its essential components",
        "That composers were always misunderstood in their own time",
        "That recorded music could never match a live performance",
      ],
      correctIndex: 1,
    },
    {
      question:
        "What did Mehta notice when listening to his own early recordings?",
      options: [
        "The technical quality was poor",
        "He had been afraid of silence and had filled every gap with sound",
        "The music was too slow and needed more energy",
        "He had used too many different instruments",
      ],
      correctIndex: 1,
    },
    {
      question: "How did Mehta describe the silences in his mature work?",
      options: [
        "Empty pauses for the audience to reflect",
        "Mistakes that became part of the composition",
        "Loaded — containing everything the preceding notes had set in motion",
        "Moments of rest built into the structure",
      ],
      correctIndex: 2,
    },
    {
      question:
        "What happened during the longest pause at the first performance of Mehta's final composition?",
      options: [
        "The entire audience sat in perfect silence",
        "Several audience members left, uncertain whether the concert had ended",
        "The performers stood and acknowledged the audience",
        "The lights dimmed as part of the performance",
      ],
      correctIndex: 1,
    },
    {
      question:
        "What did those who stayed say about the music resuming after the long pause?",
      options: [
        "They were relieved it had finally continued",
        "They felt the music was too quiet after the silence",
        "They heard it entirely differently",
        "They wished the silence had lasted longer",
      ],
      correctIndex: 2,
    },
  ],

  // Grade 9 - Passage 27: A Forgotten Letter
  27: [
    {
      question: "Where were the letters discovered?",
      options: [
        "In an old trunk in the attic",
        "Inside the wall cavity behind the plaster during renovation",
        "In a safe found beneath the floorboards",
        "In the garden during landscaping work",
      ],
      correctIndex: 1,
    },
    {
      question: "How did Elio Marchetti address the woman he wrote to?",
      options: [
        "By her first name",
        "As 'Dear friend'",
        "Only as M",
        "By a code name",
      ],
      correctIndex: 2,
    },
    {
      question:
        "What did the letters notably not discuss, despite its presence being felt?",
      options: [
        "His feelings for M",
        "The political situation of the time",
        "His own fear",
        "His plans for the future",
      ],
      correctIndex: 2,
    },
    {
      question: "What did research suggest had happened to M?",
      options: [
        "She had fled to another country safely",
        "She had been deported in late 1943 and had not returned",
        "She had survived the war and moved away",
        "She had been in hiding until the war ended",
      ],
      correctIndex: 1,
    },
    {
      question: "Why had the letters apparently never been sent?",
      options: [
        "Elio had been unable to find M's address",
        "They had been written, hidden, and intended for someone who might come later",
        "The postal service had broken down during the occupation",
        "Elio had decided they were too personal to send",
      ],
      correctIndex: 1,
    },
  ],

  // Grade 10 - Passage 28: The Weight of Words
  28: [
    {
      question:
        "What central question did Adaeze Nwosu spend her career examining?",
      options: [
        "How languages develop and change over time",
        "What it means for a word to have a meaning",
        "Whether translation between languages is ever fully possible",
        "How children acquire language naturally",
      ],
      correctIndex: 1,
    },
    {
      question:
        "What did Nwosu argue was always partly a function of the relationship between speaker and world?",
      options: [
        "The grammar of a language",
        "The vocabulary available in any language",
        "Meaning — not simply a property of language as a system",
        "The ability to translate between languages",
      ],
      correctIndex: 2,
    },
    {
      question:
        "What implicit commitment did Nwosu argue the act of naming carried?",
      options: [
        "A commitment to use language accurately",
        "A responsibility to the thing named",
        "An obligation to translate the word for others",
        "A promise to keep the word's meaning stable",
      ],
      correctIndex: 1,
    },
    {
      question:
        "In what area did Nwosu's work find its most complete expression?",
      options: [
        "The language of children's literature",
        "Political speeches and public discourse",
        "Testimony — the language used by witnesses to atrocity and survivors",
        "Scientific writing and its limitations",
      ],
      correctIndex: 2,
    },
    {
      question:
        "What did Nwosu say the best testimony about extreme events did?",
      options: [
        "It resolved the problem of inadequate language",
        "It found new words to describe what had happened",
        "It made the problem of inadequate language visible rather than solving it",
        "It avoided the problem by using very simple language",
      ],
      correctIndex: 2,
    },
  ],

  // Grade 10 - Passage 29: The Bridge Between Worlds
  29: [
    {
      question:
        "Into how many languages had Selin Çelik's novels been translated?",
      options: ["Fifteen", "Twenty", "Twenty-three", "Thirty"],
      correctIndex: 2,
    },
    {
      question: "Why did Çelik choose her fourth language for writing novels?",
      options: [
        "It was the most widely spoken language in the world",
        "It was the language her publisher required",
        "It was the language in which she felt least defended and most porous",
        "It had the richest literary tradition",
      ],
      correctIndex: 2,
    },
    {
      question:
        "Why was writing in her first or second language difficult for sustained fiction?",
      options: [
        "She was not fluent enough in them for complex writing",
        "They carried the weight of family and early experience, making objectivity impossible",
        "They lacked the vocabulary she needed",
        "Her publishers did not accept manuscripts in those languages",
      ],
      correctIndex: 1,
    },
    {
      question: "How did critics describe the language in her novels?",
      options: [
        "Formal and academic in style",
        "Simple and accessible to all readers",
        "Precise but slightly tilted, as if translated from a language that did not quite exist",
        "Dense with metaphor and very difficult to follow",
      ],
      correctIndex: 2,
    },
    {
      question:
        "What was Çelik attempting to achieve by writing from the space between languages?",
      options: [
        "To make her novels appeal to readers in many countries",
        "To create a new language that combined elements of all her languages",
        "To use the gap as a position rather than simply an absence",
        "To demonstrate that translation between languages was always imperfect",
      ],
      correctIndex: 2,
    },
  ],

  // Grade 10 - Passage 30: Shadows and Light
  30: [
    {
      question:
        "What did Flemish painters of the seventeenth century understand about darkness?",
      options: [
        "It was simply the absence of light in technical terms",
        "It was a presence in its own right with texture, depth, and moral weight",
        "It was a problem to be overcome with better materials",
        "It was best avoided in religious subject matter",
      ],
      correctIndex: 1,
    },
    {
      question:
        "What is the term for Caravaggio's technique of extreme contrast between light and dark?",
      options: ["Sfumato", "Impasto", "Chiaroscuro", "Pentimento"],
      correctIndex: 2,
    },
    {
      question:
        "What does the literary tradition of irony depend on, according to the passage?",
      options: [
        "Exaggerated language and dramatic situations",
        "Meaning placed in the space between what is said and what is meant",
        "The use of darkness as a recurring symbol",
        "Contrast between minor and major characters",
      ],
      correctIndex: 1,
    },
    {
      question:
        "What does the passage say the most powerful works in any medium tend to do?",
      options: [
        "Explain themselves as clearly and completely as possible",
        "Use the latest available technology to reach audiences",
        "Preserve a residue of shadow that requires the audience to find their own orientation",
        "Follow the established conventions of their form",
      ],
      correctIndex: 2,
    },
    {
      question:
        "What does the passage say shadow is, in contrast to a merely decorative element?",
      options: [
        "A technical necessity in visual art only",
        "Constitutive — an essential part of meaning rather than an ornament",
        "A stylistic choice that varies between artists",
        "A symbol for ignorance and lack of understanding",
      ],
      correctIndex: 1,
    },
  ],
};

export function getPassageMCQs(passageId: number): MCQ[] {
  return PASSAGE_MCQS[passageId] ?? [];
}
