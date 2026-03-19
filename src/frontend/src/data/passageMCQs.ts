export interface MCQ {
  question: string;
  options: string[];
  correctIndex: number;
}

export const PASSAGE_MCQS: Record<number, MCQ[]> = {
  // Grade 1 - Passage 1: Plants Need Sun
  1: [
    {
      question: "What three things do plants need to grow?",
      options: [
        "Sunlight, water, and soil",
        "Only water and shade",
        "Sand, rocks, and ice",
        "Clouds, wind, and rain",
      ],
      correctIndex: 0,
    },
    {
      question: "What does a seed do when it is planted in the ground?",
      options: [
        "Flies up into the air",
        "Drinks water from the soil",
        "Turns into a rock",
        "Makes flowers right away",
      ],
      correctIndex: 1,
    },
    {
      question: "What do roots do for a plant?",
      options: [
        "Catch sunlight for the plant",
        "Make seeds for new plants",
        "Help the plant drink water",
        "Attract birds and butterflies",
      ],
      correctIndex: 2,
    },
    {
      question: "Which creature visits the flowers on a plant?",
      options: ["Fish", "Dogs", "Clouds", "Bees"],
      correctIndex: 3,
    },
    {
      question: "What happens to seeds that fall to the ground?",
      options: [
        "They disappear forever",
        "They become soil",
        "New plants grow from them",
        "Animals eat them all immediately",
      ],
      correctIndex: 2,
    },
  ],

  // Grade 1 - Passage 2: My Community
  2: [
    {
      question: "Long ago, where did people live?",
      options: [
        "In big cities",
        "In small villages",
        "On islands",
        "Underground",
      ],
      correctIndex: 1,
    },
    {
      question: "What did farmers do for the village?",
      options: [
        "Built new homes",
        "Helped sick people",
        "Grew food for the village",
        "Taught children to read",
      ],
      correctIndex: 2,
    },
    {
      question: "What were markets described as in the passage?",
      options: [
        "Quiet and empty",
        "Busy and noisy",
        "Dark and cold",
        "Small and peaceful",
      ],
      correctIndex: 1,
    },
    {
      question: "What did people do at markets?",
      options: [
        "Played sports",
        "Went to sleep",
        "Traded things they made",
        "Built houses",
      ],
      correctIndex: 2,
    },
    {
      question:
        "According to the passage, what makes every community stronger?",
      options: [
        "Having more money",
        "Building bigger cities",
        "Being kind",
        "Working alone",
      ],
      correctIndex: 2,
    },
  ],

  // Grade 1 - Passage 3: Land and Water
  3: [
    {
      question:
        "What are the two main features of Earth described in the passage?",
      options: [
        "Ice and fire",
        "Land and water",
        "Mountains and caves",
        "Sun and moon",
      ],
      correctIndex: 1,
    },
    {
      question: "What do rivers do according to the passage?",
      options: [
        "Form clouds",
        "Carry water to the sea",
        "Create mountains",
        "Cover hills with trees",
      ],
      correctIndex: 1,
    },
    {
      question: "What are deserts described as?",
      options: [
        "Cold and wet",
        "Flat and wide open",
        "Dry and hot",
        "Covered with forests",
      ],
      correctIndex: 2,
    },
    {
      question: "What are islands?",
      options: [
        "Very tall mountains",
        "Flat open land",
        "Land with water all around",
        "Valleys between hills",
      ],
      correctIndex: 2,
    },
    {
      question: "What can a map help us do?",
      options: ["Grow food", "Catch fish", "Find places", "Predict weather"],
      correctIndex: 2,
    },
  ],

  // Grade 2 - Passage 4: Animals and Their Homes
  4: [
    {
      question: "What is a habitat?",
      options: [
        "A type of food",
        "A place that gives an animal food, water, and shelter",
        "A kind of animal home decoration",
        "A special animal trick",
      ],
      correctIndex: 1,
    },
    {
      question: "How do fish breathe according to the passage?",
      options: [
        "Through their skin",
        "Through their mouths",
        "Through gills",
        "Through their fins",
      ],
      correctIndex: 2,
    },
    {
      question: "Where do bears sleep during winter?",
      options: ["In trees", "Under the ground", "In caves", "Near rivers"],
      correctIndex: 2,
    },
    {
      question: "What do beavers build in rivers?",
      options: [
        "Nests",
        "Dams to make ponds",
        "Underground tunnels",
        "Icy dens",
      ],
      correctIndex: 1,
    },
    {
      question: "What happens when habitats are destroyed?",
      options: [
        "Animals become bigger",
        "Animals find better food",
        "Animals lose their homes",
        "Animals move to cities",
      ],
      correctIndex: 2,
    },
  ],

  // Grade 2 - Passage 5: Early Explorers
  5: [
    {
      question: "What were early explorers looking for?",
      options: [
        "New schools",
        "New lands across the ocean",
        "Underground treasure",
        "Better weather",
      ],
      correctIndex: 1,
    },
    {
      question: "When did Christopher Columbus sail west from Spain?",
      options: ["In 1320", "In 1450", "In 1492", "In 1620"],
      correctIndex: 2,
    },
    {
      question: "What did explorers make to help other sailors travel safely?",
      options: [
        "Better ships",
        "Careful maps",
        "Stronger ropes",
        "Larger sails",
      ],
      correctIndex: 1,
    },
    {
      question: "What did Vasco da Gama find?",
      options: [
        "The Americas",
        "A sea route from Europe to India",
        "The South Pole",
        "New islands in the Pacific",
      ],
      correctIndex: 1,
    },
    {
      question: "What did explorers bring back from their voyages?",
      options: [
        "Books and paintings",
        "Spices, gold, and new foods",
        "Soldiers and weapons",
        "Only maps and journals",
      ],
      correctIndex: 1,
    },
  ],

  // Grade 2 - Passage 6: Continents of the World
  6: [
    {
      question: "How many continents does the world have?",
      options: ["Five", "Six", "Seven", "Eight"],
      correctIndex: 2,
    },
    {
      question: "Which is the biggest continent in size and population?",
      options: ["Africa", "Europe", "Asia", "North America"],
      correctIndex: 2,
    },
    {
      question: "Which continent is both a continent and a country?",
      options: ["Europe", "Australia", "Antarctica", "South America"],
      correctIndex: 1,
    },
    {
      question: "What is special about Antarctica?",
      options: [
        "It is the hottest continent",
        "It is the most populated continent",
        "It is the coldest and windiest place on Earth",
        "It is the smallest continent",
      ],
      correctIndex: 2,
    },
    {
      question: "Which is the largest ocean on Earth?",
      options: [
        "Atlantic Ocean",
        "Indian Ocean",
        "Arctic Ocean",
        "Pacific Ocean",
      ],
      correctIndex: 3,
    },
  ],

  // Grade 3 - Passage 7: The Water Cycle
  7: [
    {
      question:
        "What starts the water cycle by heating water in oceans and lakes?",
      options: ["Wind", "The Sun", "Clouds", "Rain"],
      correctIndex: 1,
    },
    {
      question: "What forms when water vapor rises and cools?",
      options: ["Ice caps", "Oceans", "Clouds", "Rivers"],
      correctIndex: 2,
    },
    {
      question: "What is precipitation?",
      options: [
        "Water turning into vapor",
        "Rain, snow, sleet, or hail falling from clouds",
        "Water flowing in rivers",
        "Plants releasing water",
      ],
      correctIndex: 1,
    },
    {
      question:
        "What is the process called when plants release water vapor through their leaves?",
      options: [
        "Precipitation",
        "Evaporation",
        "Condensation",
        "Transpiration",
      ],
      correctIndex: 3,
    },
    {
      question: "What would happen without the water cycle?",
      options: [
        "The Earth would have more oceans",
        "Life on Earth could not survive",
        "There would be more rain",
        "Plants would grow faster",
      ],
      correctIndex: 1,
    },
  ],

  // Grade 3 - Passage 8: Ancient Egypt
  8: [
    {
      question: "Where did Ancient Egyptian civilization begin?",
      options: [
        "Near the Mediterranean Sea",
        "In the Sahara Desert",
        "Near the Nile River",
        "On the Red Sea coast",
      ],
      correctIndex: 2,
    },
    {
      question: "What were Egyptian rulers called?",
      options: ["Emperors", "Pharaohs", "Sultans", "Chieftains"],
      correctIndex: 1,
    },
    {
      question: "What was the Egyptian writing system called?",
      options: ["Cuneiform", "Latin", "Hieroglyphics", "Sanskrit"],
      correctIndex: 2,
    },
    {
      question: "What did Egyptians build as grand tombs for their pharaohs?",
      options: ["Coliseums", "Temples", "Obelisks", "Pyramids"],
      correctIndex: 3,
    },
    {
      question: "How long did Ancient Egyptian civilization last?",
      options: [
        "About one hundred years",
        "About five hundred years",
        "Over three thousand years",
        "About one thousand years",
      ],
      correctIndex: 2,
    },
  ],

  // Grade 3 - Passage 9: Deserts and Rainforests
  9: [
    {
      question: "About how much of Earth's land surface do deserts cover?",
      options: [
        "About one-tenth",
        "About one-third",
        "About one-half",
        "About two-thirds",
      ],
      correctIndex: 1,
    },
    {
      question: "Where is the Sahara Desert located?",
      options: ["In Asia", "In South America", "In Australia", "In Africa"],
      correctIndex: 3,
    },
    {
      question: "How do cacti survive long droughts?",
      options: [
        "By finding underground water",
        "By storing water in their thick stems",
        "By shedding their leaves",
        "By moving to cooler areas",
      ],
      correctIndex: 1,
    },
    {
      question: "Where is the Amazon Rainforest located?",
      options: ["In Africa", "In Asia", "In North America", "In South America"],
      correctIndex: 3,
    },
    {
      question:
        "What do rainforest plants produce that is important for all life?",
      options: [
        "Fresh water",
        "Much of the world's oxygen",
        "Most of the world's food",
        "Natural medicines",
      ],
      correctIndex: 1,
    },
  ],

  // Grade 4 - Passage 10: Forces and Motion
  10: [
    {
      question: "What is a force?",
      options: [
        "A type of energy stored in batteries",
        "A push or pull that can change how an object moves",
        "The speed at which an object travels",
        "The weight of an object",
      ],
      correctIndex: 1,
    },
    {
      question: "What does gravity do?",
      options: [
        "Pushes objects away from Earth",
        "Slows things down when surfaces rub",
        "Pulls all objects toward Earth's center",
        "Makes objects float in water",
      ],
      correctIndex: 2,
    },
    {
      question: "What is friction?",
      options: [
        "A force that speeds things up",
        "A force that slows things down when two surfaces rub together",
        "A magnetic force between objects",
        "The force of gravity on water",
      ],
      correctIndex: 1,
    },
    {
      question: "In what unit do scientists measure forces?",
      options: ["Watts", "Joules", "Newtons", "Meters"],
      correctIndex: 2,
    },
    {
      question:
        "Who discovered the laws of motion more than three hundred years ago?",
      options: [
        "Albert Einstein",
        "Isaac Newton",
        "Galileo Galilei",
        "Marie Curie",
      ],
      correctIndex: 1,
    },
  ],

  // Grade 4 - Passage 11: The Roman Empire
  11: [
    {
      question: "Where did Rome begin as a small city-state?",
      options: [
        "On the banks of the Rhine River",
        "Near the coast of Spain",
        "On the banks of the Tiber River in Italy",
        "Near the Nile River in Egypt",
      ],
      correctIndex: 2,
    },
    {
      question:
        "What did Roman engineers build to carry fresh water into cities?",
      options: ["Dams", "Aqueducts", "Reservoirs", "Canals"],
      correctIndex: 1,
    },
    {
      question:
        "Which modern languages have roots in Latin, the Roman language?",
      options: [
        "English, German, and Dutch",
        "Arabic, Persian, and Turkish",
        "Spanish, French, and Italian",
        "Russian, Polish, and Czech",
      ],
      correctIndex: 2,
    },
    {
      question: "When did the Western Roman Empire fall?",
      options: ["In 100 AD", "In 300 AD", "In 476 AD", "In 1000 AD"],
      correctIndex: 2,
    },
    {
      question:
        "What helped soldiers march quickly and merchants trade efficiently?",
      options: [
        "Large warships",
        "An impressive network of roads",
        "Fast horses and chariots",
        "Detailed maps of the empire",
      ],
      correctIndex: 1,
    },
  ],

  // Grade 4 - Passage 12: Climate Zones
  12: [
    {
      question: "What determines the climate zones on Earth?",
      options: [
        "Soil type and vegetation",
        "Average temperature and rainfall",
        "Distance from the ocean only",
        "The size of the landmass",
      ],
      correctIndex: 1,
    },
    {
      question: "What are the tropics?",
      options: [
        "Regions near the poles",
        "Cold mountain areas",
        "Regions near the equator that receive intense sunlight",
        "Desert regions with no rainfall",
      ],
      correctIndex: 2,
    },
    {
      question: "How many seasons do temperate zones experience?",
      options: [
        "One season all year",
        "Two seasons",
        "Three seasons",
        "Four distinct seasons",
      ],
      correctIndex: 3,
    },
    {
      question: "Why are mountain regions cooler than lower areas?",
      options: [
        "They are closer to the poles",
        "They receive less sunlight",
        "Air grows colder at higher elevations",
        "They have more cloud cover",
      ],
      correctIndex: 2,
    },
    {
      question: "What human activity is altering climate zones globally?",
      options: [
        "Farming and fishing",
        "Building cities and roads",
        "Burning fossil fuels",
        "Cutting down rainforests only",
      ],
      correctIndex: 2,
    },
  ],

  // Grade 5 - Passage 13: The Solar System
  13: [
    {
      question: "What is the Sun?",
      options: [
        "A planet that orbits Earth",
        "A moon in the solar system",
        "A star that provides heat and light energy",
        "An asteroid near Earth",
      ],
      correctIndex: 2,
    },
    {
      question: "How many planets orbit the Sun?",
      options: ["Six", "Seven", "Eight", "Nine"],
      correctIndex: 2,
    },
    {
      question: "Which planet is the largest in the solar system?",
      options: ["Saturn", "Jupiter", "Uranus", "Neptune"],
      correctIndex: 1,
    },
    {
      question: "What are Saturn's rings made of?",
      options: [
        "Gas and dust",
        "Ice and rock particles",
        "Water and metal",
        "Clouds and mist",
      ],
      correctIndex: 1,
    },
    {
      question: "Why is Earth the only planet known to support life?",
      options: [
        "It is closest to the Sun",
        "It is the largest rocky planet",
        "It has liquid water and an atmosphere",
        "It has the most moons",
      ],
      correctIndex: 2,
    },
  ],

  // Grade 5 - Passage 14: The Silk Road
  14: [
    {
      question: "What was the Silk Road?",
      options: [
        "A river connecting China and India",
        "An ancient network of trade routes connecting China to the Mediterranean",
        "A wall built to protect China",
        "A type of road paved with silk",
      ],
      correctIndex: 1,
    },
    {
      question: "What did Chinese merchants export along the Silk Road?",
      options: [
        "Iron, coal, and timber",
        "Silk, porcelain, and tea",
        "Cotton, rice, and spices",
        "Gold, silver, and gems",
      ],
      correctIndex: 1,
    },
    {
      question:
        "Which religion spread from India to China along the Silk Road?",
      options: ["Christianity", "Islam", "Buddhism", "Hinduism"],
      correctIndex: 2,
    },
    {
      question:
        "Which empire briefly brought peace to the Silk Road in the 13th century?",
      options: [
        "The Roman Empire",
        "The Ottoman Empire",
        "The Persian Empire",
        "The Mongol Empire",
      ],
      correctIndex: 3,
    },
    {
      question: "Why did overland Silk Road routes gradually decline?",
      options: [
        "Too many bandits attacked caravans",
        "Sea trade routes were established",
        "The roads became too damaged",
        "Wars destroyed the trading cities",
      ],
      correctIndex: 1,
    },
  ],

  // Grade 5 - Passage 15: River Systems and Deltas
  15: [
    {
      question: "Where do rivers begin?",
      options: [
        "In the ocean",
        "In deserts",
        "In mountains or highlands as small streams",
        "In underground caves",
      ],
      correctIndex: 2,
    },
    {
      question: "Which river carries more freshwater than any other on Earth?",
      options: [
        "The Nile River",
        "The Amazon River",
        "The Mississippi River",
        "The Ganges River",
      ],
      correctIndex: 1,
    },
    {
      question: "What are deltas?",
      options: [
        "Deep ocean trenches at river mouths",
        "Fan-shaped landforms of deposited sediment at river mouths",
        "Mountain ranges formed by rivers",
        "Lakes created by blocked rivers",
      ],
      correctIndex: 1,
    },
    {
      question: "What was Mesopotamia called?",
      options: [
        "The cradle of civilization",
        "The heart of the desert",
        "The birthplace of exploration",
        "The land of rivers",
      ],
      correctIndex: 0,
    },
    {
      question: "What threatens the health of river systems worldwide?",
      options: [
        "Too many fish in rivers",
        "Natural flooding each year",
        "Pollution and over-extraction",
        "Too much rainfall",
      ],
      correctIndex: 2,
    },
  ],

  // Grade 6 - Passage 16: Cells: Building Blocks of Life
  16: [
    {
      question: "What is the fundamental unit of life?",
      options: ["The atom", "The molecule", "The cell", "The tissue"],
      correctIndex: 2,
    },
    {
      question: "What is the role of the nucleus in a cell?",
      options: [
        "Generating energy for the cell",
        "Acting as the control center and housing DNA",
        "Controlling what enters and leaves the cell",
        "Building proteins the cell needs",
      ],
      correctIndex: 1,
    },
    {
      question: "What do mitochondria do?",
      options: [
        "Store genetic information",
        "Capture sunlight for photosynthesis",
        "Generate energy through cellular respiration",
        "Control what enters the cell",
      ],
      correctIndex: 2,
    },
    {
      question: "What do chloroplasts within plant cells do?",
      options: [
        "Store water for the plant",
        "Break down waste products",
        "Capture sunlight and convert it into sugar through photosynthesis",
        "Transport materials within the cell",
      ],
      correctIndex: 2,
    },
    {
      question: "What does cell theory state?",
      options: [
        "Cells only exist in animals",
        "All life comes from pre-existing cells",
        "Cells are made of atoms",
        "All cells have a nucleus",
      ],
      correctIndex: 1,
    },
  ],

  // Grade 6 - Passage 17: The Renaissance
  17: [
    {
      question: "What does the word renaissance mean?",
      options: ["Revolution", "Discovery", "Rebirth", "Enlightenment"],
      correctIndex: 2,
    },
    {
      question: "Which country did the Renaissance begin in?",
      options: ["France", "Germany", "England", "Italy"],
      correctIndex: 3,
    },
    {
      question: "What did Leonardo da Vinci's notebooks contain?",
      options: [
        "Only paintings and sketches",
        "Designs for flying machines, tanks, and anatomical studies",
        "Mathematical equations",
        "Maps of the world",
      ],
      correctIndex: 1,
    },
    {
      question: "What did Johannes Gutenberg invent around 1440?",
      options: [
        "The telescope",
        "The microscope",
        "The printing press",
        "The steam engine",
      ],
      correctIndex: 2,
    },
    {
      question: "What philosophy became the guiding spirit of the Renaissance?",
      options: ["Stoicism", "Humanism", "Nihilism", "Rationalism"],
      correctIndex: 1,
    },
  ],

  // Grade 6 - Passage 18: Monsoons and Seasonal Winds
  18: [
    {
      question: "What are monsoons?",
      options: [
        "Permanent trade winds near the equator",
        "Powerful seasonal wind patterns that affect weather",
        "Cold polar winds that blow in winter",
        "Ocean currents near the coast",
      ],
      correctIndex: 1,
    },
    {
      question: "Where does the word monsoon come from?",
      options: [
        "From Greek",
        "From Sanskrit",
        "From Arabic",
        "From Portuguese",
      ],
      correctIndex: 2,
    },
    {
      question: "When does the South Asian summer monsoon begin?",
      options: ["In March", "In June", "In September", "In December"],
      correctIndex: 1,
    },
    {
      question: "What happens when the monsoon brings too much rainfall?",
      options: [
        "The desert expands",
        "Crops grow better than usual",
        "Catastrophic flooding destroys homes and farmland",
        "Temperatures drop dramatically",
      ],
      correctIndex: 2,
    },
    {
      question: "What drives the monsoon's seasonal switching?",
      options: [
        "Changes in Earth's orbit",
        "Ocean temperature differences between sea and land",
        "The tilt of the Earth's axis",
        "Volcanic eruptions",
      ],
      correctIndex: 1,
    },
  ],

  // Grade 7 - Passage 19: Ecosystems and Food Webs
  19: [
    {
      question: "What is an ecological niche?",
      options: [
        "A type of habitat in a forest",
        "The specific role an organism fills in an ecosystem",
        "A method of scientific classification",
        "The area an animal defends as territory",
      ],
      correctIndex: 1,
    },
    {
      question:
        "What do producers use to convert solar energy into organic matter?",
      options: [
        "Cellular respiration",
        "Decomposition",
        "Photosynthesis",
        "Fermentation",
      ],
      correctIndex: 2,
    },
    {
      question: "What are decomposers?",
      options: [
        "Animals that eat plants",
        "Top predators in a food chain",
        "Bacteria and fungi that break down dead organisms",
        "Plants that grow in wetlands",
      ],
      correctIndex: 2,
    },
    {
      question: "What is a keystone species?",
      options: [
        "The most numerous species in an ecosystem",
        "A species that plays a disproportionately important role in maintaining balance",
        "The largest animal in an ecosystem",
        "A species that only eats plants",
      ],
      correctIndex: 1,
    },
    {
      question: "What increases an ecosystem's resilience and productivity?",
      options: [
        "Having fewer species",
        "Stable temperature",
        "Biodiversity — the variety of species",
        "Large amounts of rainfall",
      ],
      correctIndex: 2,
    },
  ],

  // Grade 7 - Passage 20: The Industrial Revolution
  20: [
    {
      question: "Where did the Industrial Revolution begin?",
      options: [
        "In France",
        "In Germany",
        "In the United States",
        "In Britain",
      ],
      correctIndex: 3,
    },
    {
      question: "Who invented the steam engine in 1769?",
      options: [
        "Thomas Edison",
        "James Watt",
        "Richard Arkwright",
        "George Stephenson",
      ],
      correctIndex: 1,
    },
    {
      question:
        "What replaced handloom weavers during the Industrial Revolution?",
      options: ["Coal mines", "Textile mills", "Steam ships", "Iron foundries"],
      correctIndex: 1,
    },
    {
      question: "What did trade unions form to do?",
      options: [
        "Increase factory production",
        "Train factory managers",
        "Negotiate wages and improve conditions for workers",
        "Expand the railway network",
      ],
      correctIndex: 2,
    },
    {
      question: "What were working conditions in early factories like?",
      options: [
        "Safe and well-paid",
        "Relaxed with short hours",
        "Grueling, with long hours, low pay, and dangerous machinery",
        "Only for adults with training",
      ],
      correctIndex: 2,
    },
  ],

  // Grade 7 - Passage 21: Plate Tectonics
  21: [
    {
      question: "What are tectonic plates?",
      options: [
        "Large slow-moving segments of Earth's outer shell",
        "Underground rivers of molten rock",
        "Layers of the atmosphere",
        "Sections of the ocean floor only",
      ],
      correctIndex: 0,
    },
    {
      question: "Who proposed the earlier idea of continental drift?",
      options: [
        "Charles Darwin",
        "Isaac Newton",
        "Alfred Wegener",
        "Charles Lyell",
      ],
      correctIndex: 2,
    },
    {
      question:
        "What happens when two plates collide and one is forced beneath the other?",
      options: [
        "Volcanic eruption at the surface",
        "The process called subduction",
        "Formation of mid-ocean ridges",
        "An earthquake at a transform boundary",
      ],
      correctIndex: 1,
    },
    {
      question: "What is the San Andreas Fault in California?",
      options: [
        "A subduction zone",
        "A mid-ocean ridge",
        "A volcanic chain",
        "A famous transform boundary",
      ],
      correctIndex: 3,
    },
    {
      question: "What do geologists use to monitor seismic activity?",
      options: ["Satellites", "Seismographs", "Thermometers", "Barometers"],
      correctIndex: 1,
    },
  ],

  // Grade 8 - Passage 22: Genetics and Heredity
  22: [
    {
      question:
        "Who laid the foundation of genetics through experiments with pea plants?",
      options: [
        "Charles Darwin",
        "Gregor Mendel",
        "James Watson",
        "Francis Crick",
      ],
      correctIndex: 1,
    },
    {
      question: "What are alleles?",
      options: [
        "Types of genetic mutations",
        "Pairs of genes, one from each parent",
        "Sequences of proteins",
        "Sections of a chromosome",
      ],
      correctIndex: 1,
    },
    {
      question: "What did Watson and Crick discover in 1953?",
      options: [
        "The existence of chromosomes",
        "How cells divide",
        "DNA's double helix structure",
        "The genetic code for proteins",
      ],
      correctIndex: 2,
    },
    {
      question: "What are mutations?",
      options: [
        "Normal processes in healthy cells",
        "Changes in DNA sequences that can alter how traits are expressed",
        "The way genes are passed to offspring",
        "Proteins that protect cells",
      ],
      correctIndex: 1,
    },
    {
      question: "What does gene therapy hold promise for?",
      options: [
        "Creating new animal species",
        "Treating inherited diseases by correcting faulty DNA",
        "Improving crop yields",
        "Making organisms live longer",
      ],
      correctIndex: 1,
    },
  ],

  // Grade 8 - Passage 23: World War I and Its Causes
  23: [
    {
      question: "What was the immediate trigger for World War I?",
      options: [
        "Germany's invasion of France",
        "The assassination of Archduke Franz Ferdinand in Sarajevo",
        "Britain's declaration of war on Germany",
        "The sinking of a passenger ship",
      ],
      correctIndex: 1,
    },
    {
      question: "Which nations formed the Central Powers in WWI?",
      options: [
        "Britain, France, and Russia",
        "Germany, Austria-Hungary, and the Ottoman Empire",
        "USA, Italy, and Japan",
        "Spain, Portugal, and Belgium",
      ],
      correctIndex: 1,
    },
    {
      question: "What type of warfare dominated the Western Front?",
      options: [
        "Naval warfare",
        "Air combat",
        "Trench warfare",
        "Desert warfare",
      ],
      correctIndex: 2,
    },
    {
      question: "What happened when the United States entered the war in 1917?",
      options: [
        "The war immediately ended",
        "Germany surrendered at once",
        "It tipped the balance toward the Allies",
        "Russia re-entered the war",
      ],
      correctIndex: 2,
    },
    {
      question: "How many people died in World War I?",
      options: [
        "About one million",
        "About five million",
        "About ten million",
        "Seventeen million",
      ],
      correctIndex: 3,
    },
  ],

  // Grade 8 - Passage 24: Ocean Currents and Climate
  24: [
    {
      question: "What drives ocean currents?",
      options: [
        "Only wind patterns",
        "Wind, temperature differences, salinity, and Earth's rotation",
        "The gravitational pull of the Moon",
        "Changes in ocean depth",
      ],
      correctIndex: 1,
    },
    {
      question: "What does the Gulf Stream do?",
      options: [
        "Carries cold water from the Arctic southward",
        "Brings rainfall to the Sahara Desert",
        "Transports warm water from the Gulf of Mexico toward northwestern Europe",
        "Creates the El Niño weather pattern",
      ],
      correctIndex: 2,
    },
    {
      question: "What is thermohaline circulation driven by?",
      options: [
        "Wind patterns alone",
        "Differences in temperature and salinity",
        "Tidal forces from the Moon",
        "Volcanic activity on the ocean floor",
      ],
      correctIndex: 1,
    },
    {
      question: "What do El Niño events do?",
      options: [
        "Strengthen the Gulf Stream",
        "Create permanent changes in ocean temperature",
        "Disrupt normal Pacific currents, causing unusual weather patterns",
        "Only affect South American fisheries",
      ],
      correctIndex: 2,
    },
    {
      question:
        "How could melting glacial ice affect thermohaline circulation?",
      options: [
        "It would speed up the circulation",
        "It would have no effect on circulation",
        "It would warm the Atlantic Ocean significantly",
        "Adding freshwater could weaken the circulation",
      ],
      correctIndex: 3,
    },
  ],

  // Grade 9 - Passage 25: Photosynthesis and Cellular Respiration
  25: [
    {
      question: "Where does photosynthesis occur in plant cells?",
      options: [
        "In the mitochondria",
        "In the nucleus",
        "In the chloroplasts",
        "In the cell membrane",
      ],
      correctIndex: 2,
    },
    {
      question:
        "What does photosynthesis convert carbon dioxide and water into?",
      options: [
        "Protein and oxygen",
        "Glucose and oxygen",
        "ATP and water",
        "Nitrogen and carbon",
      ],
      correctIndex: 1,
    },
    {
      question:
        "Where does cellular respiration primarily occur in eukaryotic cells?",
      options: [
        "In the chloroplasts",
        "In the nucleus",
        "In the ribosomes",
        "In the mitochondria",
      ],
      correctIndex: 3,
    },
    {
      question:
        "Approximately how many ATP molecules does complete aerobic respiration of one glucose molecule yield?",
      options: ["About 10", "About 20", "About 36 to 38", "About 50"],
      correctIndex: 2,
    },
    {
      question:
        "How are photosynthesis and cellular respiration described in the passage?",
      options: [
        "Identical processes occurring in different locations",
        "Complementary processes that together sustain nearly all life on Earth",
        "Competing processes that alternate by season",
        "Independent processes with no connection to each other",
      ],
      correctIndex: 1,
    },
  ],

  // Grade 9 - Passage 26: The Cold War and Global Tensions
  26: [
    {
      question: "What was the Cold War?",
      options: [
        "A war fought in Antarctica",
        "A prolonged geopolitical rivalry between the US and Soviet Union from 1947 to 1991",
        "A series of naval battles in the Pacific Ocean",
        "A diplomatic effort to end nuclear weapons",
      ],
      correctIndex: 1,
    },
    {
      question: "What was the Cuban Missile Crisis of 1962?",
      options: [
        "A US invasion of Cuba",
        "A Cuban revolt against the Soviet Union",
        "A moment when Soviet missiles in Cuba brought the world near nuclear war",
        "An economic embargo against Cuba",
      ],
      correctIndex: 2,
    },
    {
      question:
        "What was the doctrine that paradoxically prevented direct conflict between the superpowers?",
      options: [
        "Détente",
        "NATO alliance",
        "Mutually assured destruction",
        "The Marshall Plan",
      ],
      correctIndex: 2,
    },
    {
      question:
        "What event in 1989 symbolized the end of the Cold War division?",
      options: [
        "The dissolution of the Soviet Union",
        "The fall of the Berlin Wall",
        "The signing of the SALT treaty",
        "The withdrawal from Afghanistan",
      ],
      correctIndex: 1,
    },
    {
      question: "When did the Soviet Union formally dissolve?",
      options: ["In 1985", "In 1989", "In December 1991", "In 1995"],
      correctIndex: 2,
    },
  ],

  // Grade 9 - Passage 27: Urbanization and Megacities
  27: [
    {
      question:
        "What percentage of the world's population lived in urban areas in 1800?",
      options: [
        "Less than three percent",
        "About ten percent",
        "About twenty-five percent",
        "About forty percent",
      ],
      correctIndex: 0,
    },
    {
      question: "What is a megacity?",
      options: [
        "Any city with a subway system",
        "An urban agglomeration with more than ten million inhabitants",
        "A city with more than one million people",
        "The capital city of a large country",
      ],
      correctIndex: 1,
    },
    {
      question: "What are informal settlements or slums?",
      options: [
        "New planned neighborhoods in cities",
        "Areas near industrial zones",
        "Housing for hundreds of millions in inadequate conditions without secure tenure",
        "Temporary camps for migrant workers",
      ],
      correctIndex: 2,
    },
    {
      question:
        "What do smart city technologies use to optimize city functions?",
      options: [
        "Large teams of human planners",
        "Sensors and data analytics",
        "Artificial rivers and green spaces",
        "Solar panels and wind turbines only",
      ],
      correctIndex: 1,
    },
    {
      question: "What does the UN project about urban population by 2050?",
      options: [
        "Half of humanity will be urban",
        "Cities will begin to shrink",
        "Two-thirds of humanity will be urban dwellers",
        "All people will live in megacities",
      ],
      correctIndex: 2,
    },
  ],

  // Grade 10 - Passage 28: Quantum Mechanics and Modern Physics
  28: [
    {
      question: "What does quantum mechanics govern?",
      options: [
        "The motion of planets and stars",
        "The behavior of matter and energy at atomic and subatomic scales",
        "The flow of electricity in circuits",
        "The movement of fluids",
      ],
      correctIndex: 1,
    },
    {
      question: "What did Max Planck propose in 1900?",
      options: [
        "That atoms have a nucleus",
        "That light travels at a constant speed",
        "That energy is quantized, exchanged only in discrete packets",
        "That electrons orbit nuclei in fixed paths",
      ],
      correctIndex: 2,
    },
    {
      question: "What does Heisenberg's Uncertainty Principle establish?",
      options: [
        "Particles travel faster than light",
        "Energy and mass are equivalent",
        "Position and momentum of a particle cannot both be known with perfect precision simultaneously",
        "All particles have wave properties",
      ],
      correctIndex: 2,
    },
    {
      question: "What is quantum entanglement?",
      options: [
        "A type of chemical bonding between atoms",
        "Particles correlated such that measuring one instantly determines the state of the other",
        "The way electrons orbit atomic nuclei",
        "A method for splitting atoms",
      ],
      correctIndex: 1,
    },
    {
      question: "Which technologies does quantum mechanics underpin?",
      options: [
        "Steam engines and internal combustion",
        "Transistors, lasers, MRI scanners, and solar cells",
        "Radio waves and satellite communications",
        "Dams and hydroelectric power",
      ],
      correctIndex: 1,
    },
  ],

  // Grade 10 - Passage 29: Colonialism and Its Legacy
  29: [
    {
      question: "What did the Berlin Conference of 1884-1885 formalize?",
      options: [
        "A peace treaty between European nations",
        "The carving of Africa among European powers with minimal regard for existing boundaries",
        "The creation of the United Nations",
        "Trade agreements between Europe and Asia",
      ],
      correctIndex: 1,
    },
    {
      question: "What were colonial economic structures designed to do?",
      options: [
        "Develop local industries in colonies",
        "Educate indigenous populations",
        "Extract resources and channel profits to metropolitan centers",
        "Create equal trading partnerships",
      ],
      correctIndex: 2,
    },
    {
      question:
        "Who are scholars associated with post-colonial theory mentioned in the passage?",
      options: [
        "Marx, Engels, and Lenin",
        "Fanon, Said, and Achebe",
        "Kant, Hegel, and Nietzsche",
        "Rousseau, Voltaire, and Montesquieu",
      ],
      correctIndex: 1,
    },
    {
      question: "What accelerated decolonization after World War II?",
      options: [
        "Weakened European powers facing nationalist movements and international pressure",
        "Military victories by colonial nations",
        "A United Nations decree ordering independence",
        "Economic agreements between Europe and Africa",
      ],
      correctIndex: 0,
    },
    {
      question:
        "What are contemporary responses to colonial history mentioned in the passage?",
      options: [
        "Military interventions and sanctions",
        "Reparations debates, cultural restitution, and truth and reconciliation processes",
        "New trade agreements and investment funds",
        "Border adjustments and population transfers",
      ],
      correctIndex: 1,
    },
  ],

  // Grade 10 - Passage 30: Climate Change and Environmental Policy
  30: [
    {
      question:
        "What has driven climate change primarily, according to the passage?",
      options: [
        "Natural volcanic activity and solar cycles",
        "Anthropogenic greenhouse gas emissions from fossil fuel combustion, deforestation, and industrial agriculture",
        "Changes in Earth's orbit around the Sun",
        "Ocean current disruptions",
      ],
      correctIndex: 1,
    },
    {
      question:
        "By approximately how much have global average temperatures risen above pre-industrial baselines?",
      options: [
        "0.5 degrees Celsius",
        "1.1 degrees Celsius",
        "2.5 degrees Celsius",
        "3 degrees Celsius",
      ],
      correctIndex: 1,
    },
    {
      question: "What did the Paris Agreement of 2015 commit nations to?",
      options: [
        "Eliminating all fossil fuel use by 2030",
        "Limiting warming to well below 2 degrees Celsius above pre-industrial levels",
        "Planting one trillion trees worldwide",
        "Replacing all coal power by 2025",
      ],
      correctIndex: 1,
    },
    {
      question:
        "What are nature-based solutions for climate change mentioned in the passage?",
      options: [
        "Building seawalls and flood barriers",
        "Using nuclear power instead of fossil fuels",
        "Restoring forests, wetlands, and mangroves for carbon sequestration",
        "Developing carbon capture machines",
      ],
      correctIndex: 2,
    },
    {
      question:
        "What concentration of CO2 (parts per million) exists in the atmosphere today?",
      options: [
        "About 280 ppm",
        "About 350 ppm",
        "Over 420 ppm",
        "About 500 ppm",
      ],
      correctIndex: 2,
    },
  ],
};

export function getPassageMCQs(passageId: number): MCQ[] {
  return PASSAGE_MCQS[passageId] ?? [];
}
