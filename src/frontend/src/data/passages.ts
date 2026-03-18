export interface PassageData {
  id: number;
  title: string;
  content: string;
  gradeLevel: number;
  subject: string;
}

export const PASSAGES: PassageData[] = [
  // Grade 1
  {
    id: 1,
    gradeLevel: 1,
    subject: "Science",
    title: "Plants Need Sun",
    content:
      "Plants need sunlight to grow. They also need water and soil. A seed grows into a plant when it gets what it needs.",
  },
  {
    id: 2,
    gradeLevel: 1,
    subject: "History",
    title: "My Community",
    content:
      "Long ago, people lived in small villages. They helped each other every day. Communities have changed, but people still help one another.",
  },
  {
    id: 3,
    gradeLevel: 1,
    subject: "Geography",
    title: "Land and Water",
    content:
      "Earth has land and water. Mountains are very tall. Rivers carry water to the sea.",
  },
  // Grade 2
  {
    id: 4,
    gradeLevel: 2,
    subject: "Science",
    title: "Animals and Their Homes",
    content:
      "Animals live in different places called habitats. Fish live in water. Birds build nests in trees. Bears sleep in caves during winter.",
  },
  {
    id: 5,
    gradeLevel: 2,
    subject: "History",
    title: "Early Explorers",
    content:
      "Many years ago, brave explorers sailed on big ships. They wanted to find new lands. Some explorers made maps of the places they found.",
  },
  {
    id: 6,
    gradeLevel: 2,
    subject: "Geography",
    title: "Continents of the World",
    content:
      "The world has seven continents. Asia is the biggest continent. Antarctica is the coldest place on Earth. People live on every continent except Antarctica.",
  },
  // Grade 3
  {
    id: 7,
    gradeLevel: 3,
    subject: "Science",
    title: "The Water Cycle",
    content:
      "Water moves around the Earth in a cycle. The sun heats water and turns it into vapor. The vapor rises and forms clouds. Rain falls from clouds and fills rivers and oceans.",
  },
  {
    id: 8,
    gradeLevel: 3,
    subject: "History",
    title: "Ancient Egypt",
    content:
      "Ancient Egypt was a great civilization that began near the Nile River. The Egyptians built huge pyramids as tombs for their pharaohs. They also invented one of the first writing systems called hieroglyphics.",
  },
  {
    id: 9,
    gradeLevel: 3,
    subject: "Geography",
    title: "Deserts and Rainforests",
    content:
      "A desert is a dry place that receives very little rain. The Sahara in Africa is the largest hot desert. Rainforests are wet, warm, and full of plants and animals.",
  },
  // Grade 4
  {
    id: 10,
    gradeLevel: 4,
    subject: "Science",
    title: "Forces and Motion",
    content:
      "A force is a push or pull that can change how an object moves. Gravity pulls everything toward Earth. Friction slows things down. Scientists measure forces in units called Newtons.",
  },
  {
    id: 11,
    gradeLevel: 4,
    subject: "History",
    title: "The Roman Empire",
    content:
      "The Roman Empire was one of the most powerful civilizations in history. Romans built roads, aqueducts, and great buildings. At its peak the empire covered much of Europe, North Africa, and parts of Asia. It fell in 476 AD.",
  },
  {
    id: 12,
    gradeLevel: 4,
    subject: "Geography",
    title: "Climate Zones",
    content:
      "The Earth is divided into climate zones based on temperature and rainfall. The tropics near the equator are hot and humid. Temperate zones have four seasons. Polar regions near the poles are freezing cold most of the year.",
  },
  // Grade 5
  {
    id: 13,
    gradeLevel: 5,
    subject: "Science",
    title: "The Solar System",
    content:
      "Our solar system has the Sun and eight planets orbiting it. The four inner planets are rocky, while the outer planets are gas giants. Jupiter is the largest planet. Scientists use telescopes and spacecraft to explore our solar system.",
  },
  {
    id: 14,
    gradeLevel: 5,
    subject: "History",
    title: "The Silk Road",
    content:
      "The Silk Road was an ancient network of trade routes connecting China to the Mediterranean Sea. Merchants traveled thousands of miles to trade silk, spices, and other goods. Ideas and religions also spread along these routes, shaping civilizations.",
  },
  {
    id: 15,
    gradeLevel: 5,
    subject: "Geography",
    title: "River Systems and Deltas",
    content:
      "Rivers shape the land around them as they flow toward the sea. They carry sediment and deposit it at their mouths, forming deltas. The Amazon carries more water than any other river. River valleys were home to early civilizations.",
  },
  // Grade 6
  {
    id: 16,
    gradeLevel: 6,
    subject: "Science",
    title: "Cells: Building Blocks of Life",
    content:
      "All living organisms are made of cells, the basic unit of life. Plant cells contain a cell wall and chloroplasts that allow photosynthesis. The nucleus contains DNA with genetic instructions. Scientists use microscopes to study these tiny structures.",
  },
  {
    id: 17,
    gradeLevel: 6,
    subject: "History",
    title: "The Renaissance",
    content:
      "The Renaissance was a period of cultural rebirth in Europe that began in Italy around the 14th century. Artists and scientists challenged old ways of thinking. Leonardo da Vinci was both a painter and an inventor. The printing press helped spread Renaissance ideas across Europe.",
  },
  {
    id: 18,
    gradeLevel: 6,
    subject: "Geography",
    title: "Monsoons and Seasonal Winds",
    content:
      "Monsoons are seasonal wind patterns that bring heavy rainfall to large parts of Asia, Africa, and Australia. Farmers depend on monsoon rains to irrigate crops. When monsoons fail, droughts can devastate entire regions and lead to food shortages.",
  },
  // Grade 7
  {
    id: 19,
    gradeLevel: 7,
    subject: "Science",
    title: "Ecosystems and Food Webs",
    content:
      "An ecosystem is a community of organisms interacting with each other and their environment. Producers convert solar energy into food through photosynthesis. Consumers eat producers or other consumers. Decomposers return nutrients to the soil. Removing one species can disrupt the entire food web.",
  },
  {
    id: 20,
    gradeLevel: 7,
    subject: "History",
    title: "The Industrial Revolution",
    content:
      "The Industrial Revolution began in Britain in the late 18th century and transformed how goods were made. Steam engines powered factories and locomotives, enabling mass production and faster transport. Workers moved to cities, but harsh conditions prompted new labor reform movements.",
  },
  {
    id: 21,
    gradeLevel: 7,
    subject: "Geography",
    title: "Plate Tectonics",
    content:
      "The Earth's lithosphere is divided into tectonic plates that move slowly over time. Colliding plates form mountain ranges or deep ocean trenches. Diverging plates create new ocean floor at mid-ocean ridges. Earthquakes and volcanoes occur most often at plate boundaries.",
  },
  // Grade 8
  {
    id: 22,
    gradeLevel: 8,
    subject: "Science",
    title: "Genetics and Heredity",
    content:
      "Genetics studies how traits are inherited across generations. Gregor Mendel discovered basic principles of heredity using pea plants. Traits are determined by genes that come in pairs called alleles. Dominant alleles mask recessive ones. Modern genetics includes DNA sequencing and gene-related disease research.",
  },
  {
    id: 23,
    gradeLevel: 8,
    subject: "History",
    title: "World War I and Its Causes",
    content:
      "World War I, fought from 1914 to 1918, was triggered by the assassination of Archduke Franz Ferdinand. Underlying causes included militarism, alliances, imperial rivalries, and rising nationalism. New technologies made warfare more devastating than ever. The war's end reshaped borders and planted the seeds for World War II.",
  },
  {
    id: 24,
    gradeLevel: 8,
    subject: "Geography",
    title: "Ocean Currents and Climate",
    content:
      "Ocean currents are large-scale water movements driven by wind, temperature, and Earth's rotation. Warm currents like the Gulf Stream carry heat from the tropics toward polar regions, moderating nearby coastlines. Cold currents bring nutrients to the surface, supporting rich marine life. Disruptions to ocean circulation affect global climate patterns.",
  },
  // Grade 9
  {
    id: 25,
    gradeLevel: 9,
    subject: "Science",
    title: "Photosynthesis and Cellular Respiration",
    content:
      "Photosynthesis and cellular respiration are complementary biochemical processes. In photosynthesis, chloroplasts use light energy to convert carbon dioxide and water into glucose and oxygen. Cellular respiration in mitochondria breaks down glucose to release ATP energy, producing carbon dioxide and water. Together they maintain the carbon cycle and enable energy flow through ecosystems.",
  },
  {
    id: 26,
    gradeLevel: 9,
    subject: "History",
    title: "The Cold War and Global Tensions",
    content:
      "The Cold War was a period of geopolitical tension between the United States and Soviet Union from 1947 to 1991. Rather than direct conflict, the rivalry was expressed through arms races, proxy wars, and ideological competition. The Cuban Missile Crisis brought the world close to nuclear war. The Cold War ended with the dissolution of the Soviet Union, reshaping the international order.",
  },
  {
    id: 27,
    gradeLevel: 9,
    subject: "Geography",
    title: "Urbanization and Megacities",
    content:
      "Urbanization, the migration from rural to urban areas, is a defining trend of the modern era. More than half the world's population now lives in cities. Megacities with over ten million people face challenges including infrastructure strain, air pollution, housing shortages, and inequality. Sustainable urban planning with green spaces and public transport is essential for managing rapid growth.",
  },
  // Grade 10
  {
    id: 28,
    gradeLevel: 10,
    subject: "Science",
    title: "Quantum Mechanics and Modern Physics",
    content:
      "Quantum mechanics describes the behavior of matter and energy at the subatomic scale where classical physics breaks down. Particles exhibit wave-particle duality, behaving as waves or particles depending on experimental context. The Heisenberg Uncertainty Principle states that position and momentum cannot both be precisely known simultaneously. These principles underpin transformative technologies including semiconductors, lasers, and MRI scanners.",
  },
  {
    id: 29,
    gradeLevel: 10,
    subject: "History",
    title: "Colonialism and Its Legacy",
    content:
      "European colonialism, reaching its peak in the 19th and early 20th centuries, reshaped political and economic structures across Africa, Asia, and the Americas. Colonial powers extracted resources and suppressed indigenous cultures. Decolonization movements of the mid-20th century led to independence for dozens of nations, yet economic disparities and ethnic conflicts persist as lasting legacies of colonial rule.",
  },
  {
    id: 30,
    gradeLevel: 10,
    subject: "Geography",
    title: "Climate Change and Environmental Policy",
    content:
      "Climate change, driven by fossil fuel combustion and deforestation, represents one of the most complex challenges of the contemporary era. Rising atmospheric greenhouse gases trap heat, causing temperature increases, glacial retreat, sea-level rise, and extreme weather events. International agreements like the Paris Accord seek coordinated emissions reductions, yet tensions between economic development and environmental sustainability continue to complicate global climate action.",
  },
];

const SUBJECTS = ["Science", "History", "Geography"] as const;

/**
 * Get a passage for a student given their effective grade level and how many
 * tests they have already taken (for subject rotation).
 */
export function getPassageForLevel(
  gradeLevel: number,
  testsTaken: number,
): PassageData | null {
  const level = Math.max(1, Math.min(10, gradeLevel));
  const subject = SUBJECTS[testsTaken % 3];
  const passage = PASSAGES.find(
    (p) => p.gradeLevel === level && p.subject === subject,
  );
  if (passage) return passage;
  // Fallback: any passage at this level
  return PASSAGES.find((p) => p.gradeLevel === level) ?? null;
}
