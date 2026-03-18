export interface PracticeQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export type GradePracticeQuestions = Record<number, PracticeQuestion[]>;

const practiceQuestions: GradePracticeQuestions = {
  1: [
    {
      question: "What is a habitat?",
      options: [
        "A type of food",
        "The natural home of an animal",
        "A kind of weather",
        "A school subject",
      ],
      correctIndex: 1,
      explanation:
        "A habitat is the natural place where an animal or plant lives and grows.",
    },
    {
      question: "Why do birds fly south in winter?",
      options: [
        "To find sunshine",
        "To look for friends",
        "To find warmer weather and food",
        "Because they are tired",
      ],
      correctIndex: 2,
      explanation:
        "Birds migrate south in winter to find warmer temperatures and more food.",
    },
    {
      question: "What is a continent?",
      options: [
        "A very small island",
        "A type of ocean",
        "A very large area of land",
        "A kind of cloud",
      ],
      correctIndex: 2,
      explanation:
        "A continent is one of the large landmasses of Earth, like Asia or Africa.",
    },
    {
      question: "Which season comes after summer?",
      options: ["Spring", "Winter", "Autumn/Fall", "Monsoon"],
      correctIndex: 2,
      explanation:
        "The four seasons go: Spring, Summer, Autumn (Fall), Winter.",
    },
    {
      question: "What do plants need to grow?",
      options: [
        "Darkness and cold",
        "Sunlight, water, and soil",
        "Sand and stones only",
        "Just water",
      ],
      correctIndex: 1,
      explanation:
        "Plants need sunlight, water, and nutrients from soil to grow and make food.",
    },
  ],
  2: [
    {
      question: "What does climate describe?",
      options: [
        "Today's weather",
        "Typical weather patterns of a place over time",
        "The temperature inside a house",
        "Amount of rainfall in one week",
      ],
      correctIndex: 1,
      explanation:
        "Climate describes the usual weather patterns of a place measured over many years.",
    },
    {
      question: "What is a landmark?",
      options: [
        "A type of road",
        "A famous or recognizable place",
        "A forest trail",
        "A weather station",
      ],
      correctIndex: 1,
      explanation:
        "A landmark is a prominent or well-known feature of a landscape or place.",
    },
    {
      question: "What does migration mean?",
      options: [
        "Staying in one place",
        "Building a new home",
        "Moving from one place to another",
        "Eating different foods",
      ],
      correctIndex: 2,
      explanation:
        "Migration means moving from one region or country to settle in another.",
    },
    {
      question: "Ancient Egypt is famous for its:",
      options: [
        "Rainforests",
        "Pyramids and pharaohs",
        "Modern cities",
        "Snow mountains",
      ],
      correctIndex: 1,
      explanation:
        "Ancient Egypt is known for its pyramids, pharaohs, and Nile River civilization.",
    },
    {
      question: "What is culture?",
      options: [
        "Growing food in soil",
        "The customs and traditions of a group of people",
        "A type of science experiment",
        "A weather pattern",
      ],
      correctIndex: 1,
      explanation:
        "Culture includes the customs, arts, and way of life shared by a particular group.",
    },
  ],
  3: [
    {
      question: "What is an ecosystem?",
      options: [
        "A type of machine",
        "All living things in an area and how they interact",
        "A weather forecast tool",
        "A computer program",
      ],
      correctIndex: 1,
      explanation:
        "An ecosystem includes all plants, animals, and their environment interacting together.",
    },
    {
      question: "What causes erosion?",
      options: [
        "Sunlight only",
        "Stars in the sky",
        "Wind and water wearing away land",
        "Growing plants",
      ],
      correctIndex: 2,
      explanation:
        "Erosion happens when wind and water wear away soil and rock over time.",
    },
    {
      question: "What is precipitation?",
      options: [
        "A type of cloud",
        "Water falling from the sky as rain or snow",
        "Heat from the sun",
        "A type of fossil",
      ],
      correctIndex: 1,
      explanation:
        "Precipitation includes rain, snow, sleet, or hail that falls from clouds.",
    },
    {
      question: "Democracy means people:",
      options: [
        "Have no rights",
        "Follow only one ruler",
        "Vote to choose their leaders",
        "Never make decisions",
      ],
      correctIndex: 2,
      explanation:
        "In a democracy, citizens elect representatives to govern on their behalf.",
    },
    {
      question: "What is a territory in nature?",
      options: [
        "A special type of food",
        "An area an animal defends",
        "A form of weather",
        "A mountain type",
      ],
      correctIndex: 1,
      explanation:
        "Animals establish territories to protect their food, mates, and living space.",
    },
  ],
  4: [
    {
      question: "The atmosphere mainly protects us from:",
      options: ["Rain", "Harmful solar radiation", "Cold winds", "Ocean waves"],
      correctIndex: 1,
      explanation:
        "The atmosphere, especially the ozone layer, protects Earth from harmful UV radiation.",
    },
    {
      question: "A peninsula is surrounded by water on:",
      options: ["All four sides", "One side", "Three sides", "Two sides"],
      correctIndex: 2,
      explanation:
        "A peninsula has water on three sides and is connected to mainland on one side.",
    },
    {
      question: "What is adaptation in biology?",
      options: [
        "A change that helps a species survive",
        "A type of migration pattern",
        "Weather resistance",
        "A type of food chain",
      ],
      correctIndex: 0,
      explanation:
        "Biological adaptation is a trait that improves a species' chances of survival.",
    },
    {
      question: "Parliament is best described as:",
      options: [
        "A royal palace",
        "An elected lawmaking body",
        "A type of school",
        "An army headquarters",
      ],
      correctIndex: 1,
      explanation:
        "Parliament is a legislative body whose members are elected to create laws.",
    },
    {
      question: "Photosynthesis uses sunlight to:",
      options: [
        "Create wind",
        "Make food for plants",
        "Evaporate water",
        "Heat the soil",
      ],
      correctIndex: 1,
      explanation:
        "Plants use photosynthesis to convert sunlight, water, and CO2 into sugar and oxygen.",
    },
  ],
  5: [
    {
      question: "The equator is at:",
      options: [
        "90° North latitude",
        "Zero latitude",
        "180° East longitude",
        "50° South latitude",
      ],
      correctIndex: 1,
      explanation:
        "The equator divides Earth into Northern and Southern hemispheres at 0° latitude.",
    },
    {
      question: "What is biodiversity?",
      options: [
        "One species in an area",
        "The variety of life in a region",
        "A type of farming",
        "Scientific names for plants",
      ],
      correctIndex: 1,
      explanation:
        "Biodiversity refers to the range of different organisms in a given area.",
    },
    {
      question: "The American Revolution was mainly about:",
      options: [
        "Trade routes to Asia",
        "Independence from British rule",
        "Building new cities",
        "Agricultural farming methods",
      ],
      correctIndex: 1,
      explanation:
        "American colonists fought for independence from British rule and taxation.",
    },
    {
      question: "Condensation forms:",
      options: ["Volcanoes", "Earthquakes", "Clouds and dew", "Ocean currents"],
      correctIndex: 2,
      explanation:
        "Condensation occurs when water vapor cools and turns into liquid, forming clouds.",
    },
    {
      question: "Constitutional rights are:",
      options: [
        "Rules for businesses only",
        "Basic freedoms guaranteed by law",
        "Optional guidelines",
        "School regulations",
      ],
      correctIndex: 1,
      explanation:
        "Constitutional rights are fundamental freedoms protected by a nation's constitution.",
    },
  ],
  6: [
    {
      question: "Tectonic plates mainly cause:",
      options: [
        "Ocean tides",
        "Rainfall patterns",
        "Earthquakes and volcanic activity",
        "Wind patterns",
      ],
      correctIndex: 2,
      explanation:
        "The movement of tectonic plates causes earthquakes, volcanoes, and mountain formation.",
    },
    {
      question: "Deforestation's main impact is:",
      options: [
        "Increasing biodiversity",
        "Improving air quality",
        "Destroying habitats and releasing CO2",
        "Creating more farmland without issues",
      ],
      correctIndex: 2,
      explanation:
        "Deforestation removes vital habitats and releases stored carbon into the atmosphere.",
    },
    {
      question: "Sovereignty means a nation:",
      options: [
        "Depends on others for laws",
        "Has full right to govern itself",
        "Is ruled by another country",
        "Has no army",
      ],
      correctIndex: 1,
      explanation:
        "Sovereignty is the right of a state to govern itself without external interference.",
    },
    {
      question: "The stratosphere contains:",
      options: [
        "Most weather patterns",
        "The ozone layer",
        "The ground level air",
        "Ocean currents",
      ],
      correctIndex: 1,
      explanation:
        "The stratosphere contains the ozone layer, which shields Earth from UV radiation.",
    },
    {
      question: "Imperialism historically meant:",
      options: [
        "Protecting small nations",
        "Equal trade between countries",
        "Powerful nations dominating weaker ones",
        "Sharing technology freely",
      ],
      correctIndex: 2,
      explanation:
        "Imperialism involved powerful nations extending control over other territories.",
    },
  ],
  7: [
    {
      question: "Geopolitics studies the relationship between:",
      options: [
        "Plants and soil",
        "Geography and politics",
        "Culture and language",
        "Economy and art",
      ],
      correctIndex: 1,
      explanation:
        "Geopolitics analyzes how geography influences international relations and politics.",
    },
    {
      question: "The hydrosphere includes:",
      options: [
        "All land areas on Earth",
        "The atmosphere only",
        "All water on, under, and above Earth's surface",
        "Polar ice caps only",
      ],
      correctIndex: 2,
      explanation:
        "The hydrosphere encompasses all forms of water: oceans, rivers, ice, and water vapor.",
    },
    {
      question: "Industrialization primarily transformed:",
      options: [
        "Art and music",
        "Agriculture only",
        "How goods were produced and how people worked",
        "Political borders",
      ],
      correctIndex: 2,
      explanation:
        "Industrialization shifted production from hand tools to machines and factory systems.",
    },
    {
      question: "A totalitarian state:",
      options: [
        "Gives citizens maximum freedom",
        "Has a strong civil society",
        "Controls all aspects of public and private life",
        "Encourages political opposition",
      ],
      correctIndex: 2,
      explanation:
        "Totalitarian regimes demand complete obedience and suppress all opposition.",
    },
    {
      question: "Urbanization primarily means:",
      options: [
        "Farming becoming more common",
        "People moving from cities to rural areas",
        "Population shifting from rural to urban areas",
        "Building more schools",
      ],
      correctIndex: 2,
      explanation:
        "Urbanization is the process by which more people live in cities than rural areas.",
    },
  ],
  8: [
    {
      question: "The Renaissance primarily celebrated:",
      options: [
        "Religious isolation",
        "Medieval traditions",
        "Humanism and rebirth of classical arts",
        "Industrial technology",
      ],
      correctIndex: 2,
      explanation:
        "The Renaissance was a cultural movement celebrating human achievement, art, and science.",
    },
    {
      question: "An archipelago is:",
      options: [
        "A type of mountain range",
        "A chain or group of islands",
        "An underground river",
        "A desert region",
      ],
      correctIndex: 1,
      explanation:
        "An archipelago is a sea containing a chain or cluster of islands.",
    },
    {
      question: "Osmosis involves movement of:",
      options: [
        "Air molecules",
        "Large proteins",
        "Water through a semi-permeable membrane",
        "Electrical charges",
      ],
      correctIndex: 2,
      explanation:
        "Osmosis is the movement of water from low to high solute concentration across a membrane.",
    },
    {
      question: "Mercantilism was driven by the goal of:",
      options: [
        "Sharing wealth equally",
        "Accumulating national wealth through trade",
        "Reducing exports",
        "Preventing colonization",
      ],
      correctIndex: 1,
      explanation:
        "Mercantilism held that national wealth came from having more exports than imports.",
    },
    {
      question: "Electromagnetism is the force between:",
      options: [
        "Gravity and mass",
        "Charged particles and magnetic fields",
        "Atoms in a nucleus",
        "Sound waves",
      ],
      correctIndex: 1,
      explanation:
        "Electromagnetism describes the interaction between electric charges and magnetic fields.",
    },
  ],
  9: [
    {
      question: "Hegemony refers to:",
      options: [
        "Equal partnership between nations",
        "Dominance of one power over others",
        "A type of government",
        "An economic theory",
      ],
      correctIndex: 1,
      explanation:
        "Hegemony means the leadership or dominance of one country or group over others.",
    },
    {
      question: "Mitochondria are responsible for:",
      options: [
        "Protein synthesis",
        "DNA replication",
        "Producing cellular energy (ATP)",
        "Cell division",
      ],
      correctIndex: 2,
      explanation:
        "Mitochondria are the cell's powerhouses, converting nutrients into ATP energy.",
    },
    {
      question: "A stratovolcano is characterized by:",
      options: [
        "Low, flat shape",
        "Frequent small eruptions only",
        "Steep slopes built from alternating lava and ash",
        "Ocean floor location",
      ],
      correctIndex: 2,
      explanation:
        "Stratovolcanoes are steep, symmetrical cones built up by layers of lava and pyroclastic material.",
    },
    {
      question: "Thermodynamics studies:",
      options: [
        "Sound and vibration",
        "Relationships between heat, energy, and work",
        "Light and optics",
        "Chemical bonds",
      ],
      correctIndex: 1,
      explanation:
        "Thermodynamics is the branch of physics dealing with heat and temperature and their relation to energy.",
    },
    {
      question: "Jurisprudence is the study of:",
      options: [
        "Medical practices",
        "The theory and philosophy of law",
        "Economic policy",
        "Historical dates",
      ],
      correctIndex: 1,
      explanation:
        "Jurisprudence explores the nature of law and the principles underlying legal systems.",
    },
  ],
  10: [
    {
      question: "Epistemic uncertainty refers to uncertainty in:",
      options: [
        "Physical measurements only",
        "Our knowledge and what we can know",
        "Financial markets",
        "Weather forecasting",
      ],
      correctIndex: 1,
      explanation:
        "Epistemic uncertainty stems from limited knowledge, unlike aleatory (random) uncertainty.",
    },
    {
      question: "Trophic levels describe:",
      options: [
        "Soil composition layers",
        "Feeding relationships and energy flow in an ecosystem",
        "Temperature zones of the ocean",
        "Types of climate zones",
      ],
      correctIndex: 1,
      explanation:
        "Trophic levels represent positions in a food web based on energy transfer.",
    },
    {
      question: "Geomorphology is the study of:",
      options: [
        "Earth's atmosphere",
        "Earth's surface landforms and the processes that shape them",
        "The history of human civilization",
        "Ocean floor biology",
      ],
      correctIndex: 1,
      explanation:
        "Geomorphology analyzes Earth's landforms and the erosional and tectonic forces that create them.",
    },
    {
      question: "Semiotics primarily analyzes:",
      options: [
        "Mathematical equations",
        "Biological organisms",
        "Signs, symbols, and their meanings",
        "Musical composition",
      ],
      correctIndex: 2,
      explanation:
        "Semiotics is the study of signs and symbols and how they create meaning in communication.",
    },
    {
      question: "Nucleosynthesis explains:",
      options: [
        "How black holes form",
        "The origin of chemical elements in stars",
        "Genetic mutation in organisms",
        "Continental drift",
      ],
      correctIndex: 1,
      explanation:
        "Nucleosynthesis is the process by which new atomic nuclei are formed inside stars.",
    },
  ],
};

export default practiceQuestions;
