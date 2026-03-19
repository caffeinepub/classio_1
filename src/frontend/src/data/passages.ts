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
      "Plants need sunlight to grow. They also need water and soil. A tiny seed is planted in the ground. The seed drinks water from the soil. The sun gives the seed warmth and light. Soon a small green shoot appears. The shoot grows taller each day. Leaves open up to catch the sun. The roots go deep into the earth. Roots help the plant drink water. Flowers bloom on some plants. Bees visit the flowers. The plant makes new seeds. The seeds fall to the ground. New plants will grow from those seeds.",
  },
  {
    id: 2,
    gradeLevel: 1,
    subject: "History",
    title: "My Community",
    content:
      "Long ago, people lived in small villages. They helped each other every day. Farmers grew food for the village. Bakers made bread for everyone. Teachers helped children learn to read. Builders put up new homes. Doctors helped sick people feel better. Families worked and played together. Markets were busy and noisy places. People traded things they made. Communities have changed a lot over time. Today we have big cities and towns. People still help one another. Neighbors share and care for each other. Being kind makes every community stronger.",
  },
  {
    id: 3,
    gradeLevel: 1,
    subject: "Geography",
    title: "Land and Water",
    content:
      "Earth has land and water. Mountains are very tall. Hills are smaller than mountains. Valleys lie between the hills. Rivers carry water to the sea. Lakes are water all around by land. Oceans are very big and deep. Sandy beaches are where land meets the sea. Deserts are dry and hot. Plains are flat and wide open. Forests cover many hills with trees. Islands are land with water all around. Maps show us land and water. We can use a map to find places. Our world is full of beautiful places to explore.",
  },
  // Grade 2
  {
    id: 4,
    gradeLevel: 2,
    subject: "Science",
    title: "Animals and Their Homes",
    content:
      "Animals live in different places called habitats. A habitat gives an animal food, water, and shelter. Fish live in water and breathe through gills. Birds build nests in trees to keep their eggs safe. Bears sleep in caves during the cold winter months. Rabbits dig burrows under the ground. Beavers build dams in rivers to make ponds. Penguins live on icy lands near the South Pole. Monkeys swing through leafy rainforest trees. Camels roam dry deserts and can go days without water. Prairie dogs dig tunnels under the grasslands. Sea turtles lay their eggs on sandy beaches. Animals must adapt to survive in their habitats. When habitats are destroyed, animals lose their homes. Protecting habitats keeps animals safe and healthy.",
  },
  {
    id: 5,
    gradeLevel: 2,
    subject: "History",
    title: "Early Explorers",
    content:
      "Many years ago, brave explorers sailed on big ships. They wanted to find new lands across the ocean. The journeys were long and often dangerous. Sailors faced strong storms and rough seas. Christopher Columbus sailed west from Spain in 1492. He landed on islands near the Americas. Leif Erikson from Iceland may have reached North America even earlier. Explorers made careful maps of the places they found. Their maps helped other sailors travel safely. Vasco da Gama found a sea route from Europe to India. Ferdinand Magellan led the first voyage around the whole world. Explorers brought back spices, gold, and new foods. They also shared stories of strange plants and animals. Their discoveries changed the way people saw the world. Exploration helped nations grow richer and more powerful.",
  },
  {
    id: 6,
    gradeLevel: 2,
    subject: "Geography",
    title: "Continents of the World",
    content:
      "The world has seven continents. Asia is the biggest continent in size and population. Africa is the second largest continent. North America and South America are joined by a narrow strip of land. Europe is a smaller continent with many different countries. Australia is both a continent and a country. Antarctica is the coldest and windiest place on Earth. People live on every continent except Antarctica. Scientists go to Antarctica to study ice and weather. The Pacific Ocean is the largest ocean on Earth. Each continent has its own plants, animals, and cultures. Mountain ranges, rivers, and deserts are found on most continents. The equator is an imaginary line that circles Earth's middle. Countries near the equator are usually warm all year long. Learning about continents helps us understand our amazing world.",
  },
  // Grade 3
  {
    id: 7,
    gradeLevel: 3,
    subject: "Science",
    title: "The Water Cycle",
    content:
      "Water moves around the Earth in a never-ending cycle. The sun heats water in oceans, lakes, and rivers. This heat turns liquid water into invisible water vapor. The vapor rises high into the atmosphere. As it rises, it cools and forms tiny water droplets. Those droplets clump together to make clouds. When clouds hold too much water, precipitation falls. Precipitation can be rain, snow, sleet, or hail. Rain soaks into the soil and fills underground aquifers. Rivers carry water back to the oceans. Snow on mountains melts in spring, feeding streams below. Plants absorb water through their roots and release vapor through their leaves. This process is called transpiration. The water cycle keeps Earth's water clean and moving. Without the water cycle, life on Earth could not survive.",
  },
  {
    id: 8,
    gradeLevel: 3,
    subject: "History",
    title: "Ancient Egypt",
    content:
      "Ancient Egypt was one of the greatest civilizations in history. It began near the Nile River in northeast Africa thousands of years ago. The Nile flooded each year, leaving rich dark soil on its banks. Farmers used this fertile soil to grow wheat and barley. Egyptian rulers were called pharaohs, and they held enormous power. The Egyptians built huge pyramids as grand tombs for their pharaohs. The Great Pyramid at Giza is still one of the largest structures ever made. Workers used massive stone blocks weighing several tons each. Egyptians invented one of the first writing systems called hieroglyphics. Scribes carved hieroglyphics onto temple walls and wrote on papyrus scrolls. Egyptian artists created beautiful paintings, statues, and jewelry. They believed in many gods and performed elaborate religious ceremonies. Egyptian doctors had advanced knowledge of medicine for their time. The civilization lasted for over three thousand years. Ancient Egypt's art and discoveries still inspire people today.",
  },
  {
    id: 9,
    gradeLevel: 3,
    subject: "Geography",
    title: "Deserts and Rainforests",
    content:
      "A desert is a dry region that receives very little rainfall each year. Deserts cover about one-third of Earth's land surface. The Sahara in Africa is the largest hot desert in the world. Despite being dry, deserts are home to many tough plants and animals. Cacti store water in their thick stems to survive long droughts. Camels can travel many miles without drinking water. Cold deserts also exist, like the Gobi Desert in Asia. Rainforests are the opposite of deserts, receiving heavy rain all year. The Amazon Rainforest in South America is the world's largest tropical rainforest. Thousands of species of plants and animals live there. The forest canopy blocks sunlight from reaching the ground. Rainforest plants produce much of the world's oxygen. Indigenous communities have lived in rainforests for thousands of years. Both deserts and rainforests are threatened by human activity. Protecting these environments is vital for the health of our planet.",
  },
  // Grade 4
  {
    id: 10,
    gradeLevel: 4,
    subject: "Science",
    title: "Forces and Motion",
    content:
      "A force is a push or pull that can change how an object moves. Every time you kick a ball or open a door, you are applying a force. Gravity is a force that pulls all objects toward the Earth's center. Because of gravity, objects fall to the ground when you drop them. Friction is a force that slows things down when two surfaces rub together. Without friction, your shoes would slip on the floor. Magnetic force can attract or repel objects without touching them. Applied force is when a person or machine pushes or pulls an object directly. Forces can be balanced or unbalanced. When forces are balanced, an object stays still or keeps moving at the same speed. Unbalanced forces cause objects to speed up, slow down, or change direction. Scientists measure forces in units called Newtons, named after Sir Isaac Newton. Newton discovered the laws of motion more than three hundred years ago. His three laws explain why objects behave the way they do. Understanding forces helps engineers design safe bridges, cars, and aircraft.",
  },
  {
    id: 11,
    gradeLevel: 4,
    subject: "History",
    title: "The Roman Empire",
    content:
      "The Roman Empire was one of the most powerful civilizations in world history. It began as a small city-state on the banks of the Tiber River in Italy. Over centuries, Rome's legions conquered vast territories around the Mediterranean Sea. At its peak, the empire stretched from Britain in the north to Egypt in the south. Romans built an impressive network of roads that connected every part of the empire. These roads allowed soldiers to march quickly and merchants to trade efficiently. Roman engineers also built aqueducts to carry fresh water into cities. The city of Rome itself had magnificent temples, arenas, and public baths. Latin, the Roman language, became the root of modern languages like Spanish, French, and Italian. The Romans adopted and spread Greek art, philosophy, and science. Roman law influenced legal systems still used in many countries today. Christianity spread throughout the empire during its later centuries. Political instability and invasions by Germanic tribes weakened Rome over time. The Western Roman Empire finally fell in 476 AD. However, Roman culture and engineering continued to shape European civilization for centuries.",
  },
  {
    id: 12,
    gradeLevel: 4,
    subject: "Geography",
    title: "Climate Zones",
    content:
      "The Earth is divided into climate zones based on average temperature and rainfall. The location of a place relative to the equator strongly affects its climate. The tropics are regions near the equator that receive intense sunlight all year long. Tropical climates are hot and humid, and they support lush rainforests. Temperate zones lie between the tropics and the polar regions. These areas experience four distinct seasons: spring, summer, autumn, and winter. Summers are warm, and winters can be cold and snowy. Polar regions near the North and South Poles receive very little sunlight in winter. Temperatures there can fall far below freezing, and ice covers the land and sea. Mountain regions create their own climates because air grows colder at higher elevations. Coastal areas are influenced by ocean temperatures, keeping them milder than inland regions. Deserts form in zones where dry air descends and rainfall is blocked by mountains. Climate shapes the plants, animals, and way of life in every region. Human activities, particularly burning fossil fuels, are altering climate zones globally. Understanding climate zones helps scientists predict future environmental changes.",
  },
  // Grade 5
  {
    id: 13,
    gradeLevel: 5,
    subject: "Science",
    title: "The Solar System",
    content:
      "Our solar system consists of the Sun and all the objects that orbit it. The Sun is a star that provides heat and light energy to the entire system. Eight planets orbit the Sun at different distances and speeds. The four inner planets — Mercury, Venus, Earth, and Mars — are small and rocky. The four outer planets — Jupiter, Saturn, Uranus, and Neptune — are large gas and ice giants. Jupiter is the largest planet, big enough to contain more than a thousand Earths. Saturn is famous for its spectacular ring system made of ice and rock particles. Earth is the only planet known to support life, thanks to its liquid water and atmosphere. Moons orbit most of the planets, and our Moon influences Earth's ocean tides. The asteroid belt between Mars and Jupiter contains millions of rocky objects. Comets are icy bodies that develop glowing tails when they pass near the Sun. Scientists use powerful telescopes and spacecraft to explore the solar system. Missions like Voyager and New Horizons have sent back stunning images of distant planets. The study of our solar system helps scientists understand how planets form. Space exploration continues to reveal new mysteries about our cosmic neighborhood.",
  },
  {
    id: 14,
    gradeLevel: 5,
    subject: "History",
    title: "The Silk Road",
    content:
      "The Silk Road was an ancient network of trade routes that connected China to the Mediterranean Sea. It stretched over seven thousand miles across mountains, deserts, and grasslands. Chinese merchants exported silk, porcelain, and tea to the West. In return, they received gold, glass, and exotic animals from other lands. The routes were used from about 130 BC until the 1450s AD. Caravans of camels and horses carried goods across the harsh terrain. Cities along the routes, such as Samarkand and Kashgar, grew wealthy from trade. Merchants from China, Persia, Arabia, India, and Europe met and exchanged not just goods but ideas. Mathematics, astronomy, and medical knowledge passed from one culture to another. Buddhism spread from India to China along these routes. Islam later spread westward through the same pathways. The Mongol Empire briefly brought peace and order to the Silk Road in the 13th century. Plague bacteria also traveled these routes, contributing to devastating epidemics. When sea trade routes were established, overland routes gradually declined. The Silk Road's legacy of cultural exchange shaped civilizations across Eurasia.",
  },
  {
    id: 15,
    gradeLevel: 5,
    subject: "Geography",
    title: "River Systems and Deltas",
    content:
      "Rivers are among the most important geographical features on Earth. They begin in mountains or highlands as small streams fed by rain and melting snow. As streams flow downhill, they merge and grow into larger rivers. Rivers carry water, sediment, and nutrients across vast distances. They carve valleys and canyons through the landscape over thousands of years. The Amazon River in South America carries more freshwater than any other river on Earth. The Nile River in Africa flows northward through the Sahara Desert to the Mediterranean Sea. At the mouths of rivers where they meet the sea, sediment is deposited in fan-shaped landforms called deltas. The Ganges Delta in Bangladesh and India is one of the largest and most densely populated deltas in the world. River valleys were home to early civilizations because of fertile soils and freshwater supplies. Mesopotamia, the land between the Tigris and Euphrates rivers, was called the cradle of civilization. Today, rivers supply drinking water, support agriculture, and generate hydroelectric power. Dams are built to control flooding and store water for dry seasons. Pollution and over-extraction threaten the health of river systems worldwide. Protecting rivers is essential for the communities and ecosystems that depend on them.",
  },
  // Grade 6
  {
    id: 16,
    gradeLevel: 6,
    subject: "Science",
    title: "Cells: Building Blocks of Life",
    content:
      "All living organisms are made of cells, the fundamental unit of life. Some organisms consist of only a single cell, while others, like humans, are made of trillions of cells. The cell membrane is a flexible barrier that controls what enters and leaves the cell. Inside the cell, the nucleus acts as the control center, housing DNA that carries genetic instructions. Mitochondria are organelles that generate energy through a process called cellular respiration. Plant cells differ from animal cells in several important ways. They contain a rigid cell wall that provides structural support and protection. Chloroplasts within plant cells capture sunlight and convert it into sugar through photosynthesis. Vacuoles are storage compartments that are especially large in plant cells. The endoplasmic reticulum and ribosomes work together to build proteins the cell needs. Scientists use light microscopes to observe cells under low magnification. Electron microscopes provide extremely detailed images at the nanometer scale. Cell theory, developed in the 1800s, states that all life comes from pre-existing cells. Understanding cell biology has led to breakthroughs in medicine and genetic engineering. Research on cells continues to unlock the secrets of life, disease, and aging.",
  },
  {
    id: 17,
    gradeLevel: 6,
    subject: "History",
    title: "The Renaissance",
    content:
      "The Renaissance was a remarkable period of cultural and intellectual rebirth in Europe that began in Italy around the 14th century. The word renaissance means rebirth in French. Scholars and artists rediscovered ancient Greek and Roman texts, inspiring new thinking about science, art, and philosophy. Humanism, a philosophy that focused on human potential and achievement, became the guiding spirit of the age. Leonardo da Vinci exemplified the Renaissance ideal as both a master painter and a pioneering inventor and scientist. His notebooks contained designs for flying machines, tanks, and anatomical studies centuries ahead of their time. Michelangelo painted the Sistine Chapel ceiling, one of the greatest artistic achievements in history. Niccolò Machiavelli wrote about political power in his famous work, The Prince. Galileo Galilei challenged accepted ideas by proving that Earth orbits the Sun. The invention of the printing press by Johannes Gutenberg around 1440 revolutionized the spread of knowledge. Books became more affordable, and literacy rates began to rise across Europe. Renaissance ideas spread from Italy to northern Europe through trade routes and universities. The Protestant Reformation, partly inspired by Renaissance questioning of authority, divided the Christian church. The age of exploration was also driven by Renaissance curiosity and ambition. The Renaissance laid the foundations for the modern world's science, art, and democratic values.",
  },
  {
    id: 18,
    gradeLevel: 6,
    subject: "Geography",
    title: "Monsoons and Seasonal Winds",
    content:
      "Monsoons are powerful seasonal wind patterns that dramatically affect weather across large parts of the world. The word monsoon comes from the Arabic word for season. In South Asia, the summer monsoon begins in June when moisture-laden winds blow in from the Indian Ocean. These winds bring heavy rains that drench India, Bangladesh, Pakistan, and Sri Lanka for several months. Farmers eagerly await the monsoon rains to irrigate their rice and wheat crops. When the monsoon arrives late or brings too little rain, crops fail and droughts can devastate food supplies. Conversely, too much rainfall causes catastrophic flooding that destroys homes and farmland. The East Asian monsoon brings summer rains to China, Japan, and Korea. West Africa also experiences a monsoon system that sustains the Sahel region's agriculture. The Northern Australian monsoon delivers tropical rainfall to the continent's top end each summer. Ocean temperature differences between sea and land drive the monsoon's seasonal switching. Climate scientists closely monitor monsoon patterns because billions of people depend on them for water. Changes in global climate are altering monsoon timing and intensity. Stronger storms and shifted rainy seasons threaten agricultural stability in monsoon regions. Understanding monsoons is crucial for planning water use and disaster preparedness.",
  },
  // Grade 7
  {
    id: 19,
    gradeLevel: 7,
    subject: "Science",
    title: "Ecosystems and Food Webs",
    content:
      "An ecosystem is a complex community of living organisms interacting with each other and with their physical environment. Every organism in an ecosystem fills a specific role called an ecological niche. Producers, mainly plants and algae, use photosynthesis to convert solar energy into organic matter. Primary consumers, or herbivores, eat the producers and obtain energy stored in plant tissue. Secondary consumers are carnivores that feed on herbivores, and tertiary consumers feed on them. Decomposers such as bacteria and fungi break down dead organisms, returning nutrients to the soil. A food web is a complex network of feeding relationships that shows how energy flows through an ecosystem. Unlike a simple food chain, a food web captures multiple pathways of energy transfer. Keystone species play a disproportionately important role in maintaining ecosystem balance. The removal of a keystone predator can trigger a trophic cascade that disrupts all other species. Invasive species introduced from other regions can outcompete native organisms and upset the food web. Habitat destruction from deforestation, pollution, and climate change threatens ecosystem stability worldwide. Biodiversity — the variety of species in an ecosystem — increases its resilience and productivity. Conservation efforts aim to protect habitats and restore damaged ecosystems. Studying food webs helps scientists predict how environmental changes will ripple through nature.",
  },
  {
    id: 20,
    gradeLevel: 7,
    subject: "History",
    title: "The Industrial Revolution",
    content:
      "The Industrial Revolution was a transformative period that began in Britain in the late 18th century and spread across Europe and North America. Before industrialization, most goods were made by hand in cottages or small workshops. The invention of the steam engine by James Watt in 1769 provided a powerful new source of mechanical energy. Steam-powered machines could work faster and longer than human laborers, dramatically increasing production. Textile mills replaced handloom weavers and became symbols of the new industrial economy. Coal mines expanded to fuel the furnaces of iron foundries and steam engines. Railways linked industrial cities, enabling the fast movement of raw materials and finished goods. Workers poured into cities in search of factory employment, causing rapid and often chaotic urbanization. Working conditions in early factories were grueling, with long hours, low pay, and dangerous machinery. Child labor was widespread, prompting reformers to campaign for better laws. Trade unions formed to negotiate wages and improve conditions for workers. The Industrial Revolution created enormous wealth but also severe inequality and environmental pollution. New middle classes of factory owners and managers emerged alongside an industrial working class. Inventions multiplied as entrepreneurs sought better and cheaper ways to produce goods. The Industrial Revolution fundamentally reshaped society, economics, and the relationship between humans and the natural world.",
  },
  {
    id: 21,
    gradeLevel: 7,
    subject: "Geography",
    title: "Plate Tectonics",
    content:
      "The theory of plate tectonics explains how Earth's outer shell is divided into large, slow-moving segments called tectonic plates. These plates float on the semi-molten mantle layer beneath them and move a few centimeters each year. The theory was developed in the 1960s and unified earlier ideas about continental drift proposed by Alfred Wegener. When two plates collide, the denser plate is forced beneath the lighter one in a process called subduction. Subduction zones are responsible for the world's deepest ocean trenches, like the Mariana Trench in the Pacific. Colliding continental plates buckle upward to form towering mountain ranges like the Himalayas and the Alps. Diverging plates at mid-ocean ridges pull apart, allowing magma to rise and form new oceanic crust. The Mid-Atlantic Ridge is one of the world's longest mountain chains, most of it underwater. Transform boundaries, where plates slide horizontally past each other, produce powerful earthquakes. The San Andreas Fault in California is a famous transform boundary. Volcanic activity is concentrated along plate boundaries, giving rise to chains of volcanoes like the Pacific Ring of Fire. Iceland sits on the Mid-Atlantic Ridge and experiences frequent volcanic eruptions. Earthquakes and tsunamis at subduction zones can be catastrophically destructive. Geologists use seismographs to monitor seismic activity and study the movement of plates. Understanding plate tectonics helps communities prepare for natural disasters and identify valuable mineral deposits.",
  },
  // Grade 8
  {
    id: 22,
    gradeLevel: 8,
    subject: "Science",
    title: "Genetics and Heredity",
    content:
      "Genetics is the scientific study of how traits are inherited and expressed across generations. Gregor Mendel, a 19th-century Austrian monk, laid the foundation of genetics through his careful experiments with pea plants. He discovered that traits such as flower color and seed shape are controlled by discrete units, now called genes. Genes exist in pairs called alleles, one inherited from each parent. A dominant allele masks the effect of a recessive allele when both are present. If an organism inherits two recessive alleles, the recessive trait is expressed. Mendel's principles of segregation and independent assortment explain how allele combinations are transmitted. The discovery of DNA's double helix structure by Watson and Crick in 1953 revealed the molecular basis of inheritance. DNA is made of sequences of four nucleotide bases that encode genetic instructions. Mutations are changes in DNA sequences that can alter how traits are expressed. Some mutations cause genetic disorders such as cystic fibrosis and sickle cell anemia. Advances in DNA sequencing now allow scientists to map entire genomes quickly and cheaply. Genetic engineering techniques enable researchers to modify the genes of organisms for medical and agricultural purposes. Gene therapy holds promise for treating inherited diseases by correcting faulty DNA sequences. The ethical implications of genetic modification continue to generate significant public and scientific debate.",
  },
  {
    id: 23,
    gradeLevel: 8,
    subject: "History",
    title: "World War I and Its Causes",
    content:
      "World War I, fought from 1914 to 1918, was one of the deadliest conflicts in human history. The immediate trigger was the assassination of Archduke Franz Ferdinand of Austria-Hungary in Sarajevo on June 28, 1914. However, deeper causes had been building for decades across Europe. Militarism had led major powers to greatly expand their armies and navies in an arms race. A web of military alliances meant that a conflict between two nations could quickly draw in many others. Imperial rivalry over colonies in Africa and Asia created intense competition and resentment among European powers. Nationalist movements, especially in the multi-ethnic Austro-Hungarian and Ottoman empires, stoked ethnic tensions. Within weeks of Ferdinand's assassination, Europe was engulfed in war. Germany, Austria-Hungary, and the Ottoman Empire formed the Central Powers. Britain, France, Russia, and later the United States joined the Allied Powers. New technologies made the war far more destructive than any previous conflict. Machine guns, artillery, poison gas, tanks, and aircraft caused millions of casualties. The Western Front became a brutal stalemate of trench warfare stretching across France and Belgium. Russia's collapse in revolution in 1917 allowed Germany to focus on the Western Front. The entry of the United States that same year tipped the balance toward the Allies. The war ended in November 1918, leaving seventeen million dead and Europe's political order shattered. The peace settlement planted seeds of resentment that would contribute to World War II just two decades later.",
  },
  {
    id: 24,
    gradeLevel: 8,
    subject: "Geography",
    title: "Ocean Currents and Climate",
    content:
      "Ocean currents are large-scale, continuous movements of seawater driven by wind, temperature differences, salinity, and Earth's rotation. They act like a global conveyor belt, redistributing heat around the planet. Warm surface currents carry heat energy from the tropics toward the poles. The Gulf Stream, one of the most powerful currents in the world, transports warm water from the Gulf of Mexico northward along the eastern United States and across the Atlantic to northwestern Europe. This current keeps coastal cities like London and Dublin significantly warmer in winter than their latitudes would otherwise suggest. Cold deep-water currents flow in the opposite direction along the ocean floor, completing the circulation loop. This global pattern of connected currents is called thermohaline circulation, driven by differences in temperature and salinity. Cold currents welling up along continental coasts bring nutrient-rich water to the surface, supporting productive fishing industries. The Humboldt Current off South America's Pacific coast is one of the world's most biologically productive marine zones. El Niño events disrupt normal Pacific currents, causing unusual weather patterns across the globe including droughts, floods, and temperature extremes. Melting glacial ice from climate change is adding freshwater to the oceans, potentially weakening thermohaline circulation. A significant slowdown of the Atlantic circulation could bring cooler temperatures to northwestern Europe. Scientists use ocean buoys, satellites, and underwater sensors to monitor current patterns. Understanding ocean circulation is essential for accurate climate modeling and weather prediction. The health of ocean currents is deeply intertwined with the stability of Earth's climate system.",
  },
  // Grade 9
  {
    id: 25,
    gradeLevel: 9,
    subject: "Science",
    title: "Photosynthesis and Cellular Respiration",
    content:
      "Photosynthesis and cellular respiration are complementary biochemical processes that together sustain nearly all life on Earth. Photosynthesis occurs in the chloroplasts of plant cells, algae, and cyanobacteria. During photosynthesis, light energy is absorbed by chlorophyll and used to convert carbon dioxide and water into glucose and oxygen. The overall reaction can be represented as: 6CO2 + 6H2O + light energy → C6H12O6 + 6O2. This process occurs in two stages: the light-dependent reactions that generate ATP and NADPH, and the Calvin cycle that uses these energy carriers to synthesize glucose. Cellular respiration, the complementary process, occurs primarily in the mitochondria of eukaryotic cells. It breaks down glucose molecules to release the chemical energy stored in their bonds as usable ATP. The complete aerobic respiration of one glucose molecule yields approximately 36 to 38 ATP molecules. The overall reaction reverses photosynthesis: C6H12O6 + 6O2 → 6CO2 + 6H2O + energy. Both processes rely on electron transport chains embedded in specialized membranes. Photosynthesis drives the carbon cycle by fixing atmospheric CO2 into organic compounds that form the base of food webs. Cellular respiration returns CO2 to the atmosphere, completing the cycle. The balance between these two processes helps regulate the atmospheric concentration of oxygen and carbon dioxide. Human activities that reduce plant biomass or burn fossil carbon are disrupting this balance. Understanding these processes at the molecular level has advanced biotechnology, including the development of biofuels and carbon capture strategies.",
  },
  {
    id: 26,
    gradeLevel: 9,
    subject: "History",
    title: "The Cold War and Global Tensions",
    content:
      "The Cold War was a prolonged period of geopolitical rivalry between the United States and the Soviet Union that shaped global politics from 1947 to 1991. Rather than direct military confrontation, the superpowers competed through arms buildups, ideological propaganda, economic competition, and proxy conflicts around the world. The United States championed liberal democracy and free-market capitalism, while the Soviet Union promoted a communist model of centralized state control. Europe was divided between NATO allies in the West and Soviet-dominated nations in the East, separated physically by the Iron Curtain. The arms race produced tens of thousands of nuclear warheads on both sides, creating a doctrine of mutually assured destruction that paradoxically prevented direct conflict. The Cuban Missile Crisis of 1962 brought the world to the brink of nuclear war when Soviet missiles were discovered in Cuba. Tense diplomatic negotiations between President Kennedy and Premier Khrushchev narrowly averted catastrophe. Proxy wars in Korea, Vietnam, Angola, and Afghanistan cost millions of lives without resolving the superpower rivalry. Space exploration became another arena of competition, with the Soviet Union launching the first satellite and the United States landing on the Moon. Détente in the 1970s temporarily eased tensions through arms control agreements. However, renewed hostility in the 1980s under President Reagan and Soviet leader Gorbachev's reformist policies ultimately hastened the Soviet Union's collapse. The Berlin Wall fell in 1989, symbolizing the end of the Cold War division. The Soviet Union formally dissolved in December 1991, ending the era of bipolar global rivalry. The Cold War's legacy includes NATO's expansion, persistent regional conflicts, and nuclear proliferation challenges that continue today.",
  },
  {
    id: 27,
    gradeLevel: 9,
    subject: "Geography",
    title: "Urbanization and Megacities",
    content:
      "Urbanization — the large-scale migration of people from rural areas to cities — has accelerated dramatically over the past two centuries. In 1800, less than three percent of the world's population lived in urban areas; today that figure exceeds fifty-five percent. The United Nations projects that two-thirds of humanity will be urban dwellers by 2050. Economic opportunity, access to education, healthcare, and infrastructure draws migrants to cities in search of better livelihoods. Megacities, urban agglomerations with more than ten million inhabitants, have multiplied rapidly, particularly in Asia and Africa. Tokyo, Delhi, Shanghai, São Paulo, and Mexico City are among the world's most populous metropolitan areas. Rapid urbanization places severe strain on infrastructure, including water supply, sanitation, transportation, and housing. Informal settlements, or slums, house hundreds of millions of people in inadequate conditions without secure tenure. Air pollution from vehicle emissions and industrial activity poses serious health risks in many megacities. Traffic congestion reduces productivity and quality of life, costing urban economies billions annually. Green urban planning principles advocate for mixed-use zoning, public transit networks, parks, and sustainable building standards. Smart city technologies use sensors and data analytics to optimize energy use, traffic flow, and emergency response. Climate change makes cities increasingly vulnerable to flooding, heat islands, and water scarcity. Equitable urban development that provides affordable housing and services to all residents is a pressing global challenge. The future of human civilization will largely be shaped by how well cities manage growth sustainably and inclusively.",
  },
  // Grade 10
  {
    id: 28,
    gradeLevel: 10,
    subject: "Science",
    title: "Quantum Mechanics and Modern Physics",
    content:
      "Quantum mechanics is the branch of physics that governs the behavior of matter and energy at the atomic and subatomic scales, where classical Newtonian physics ceases to apply. At the quantum scale, energy is not continuous but quantized, meaning it can only be exchanged in discrete packets called quanta or photons. This insight, first proposed by Max Planck in 1900, launched a revolution in physical understanding. Particles such as electrons exhibit wave-particle duality, demonstrating both wave-like interference and particle-like detection depending on the experimental setup. The double-slit experiment vividly demonstrates that unobserved particles travel as waves through both slits simultaneously, creating an interference pattern on a detector screen. The act of measurement itself collapses the quantum wave function, forcing the particle into a definite state. Werner Heisenberg's Uncertainty Principle establishes that the position and momentum of a particle cannot both be known with perfect precision simultaneously; increasing the precision of one measurement inevitably reduces precision in the other. Erwin Schrödinger's famous thought experiment involving a cat in a box illustrates the philosophical puzzles of quantum superposition. The Copenhagen interpretation, proposed by Bohr and Heisenberg, remains the most widely taught framework for understanding quantum phenomena, though alternatives like the many-worlds interpretation continue to be explored. Quantum entanglement allows two particles to be correlated such that measuring one instantly determines the state of the other, regardless of the distance separating them. This phenomenon, which Einstein called spooky action at a distance, has been experimentally verified and underlies quantum cryptography and quantum computing. Quantum mechanics underpins transformative technologies including transistors, lasers, MRI scanners, and solar cells. Quantum computers exploit superposition and entanglement to perform certain calculations exponentially faster than classical computers. Ongoing research in quantum field theory seeks to unify quantum mechanics with Einstein's theory of general relativity. The philosophical implications of quantum indeterminacy continue to challenge our understanding of reality, causality, and the limits of human knowledge.",
  },
  {
    id: 29,
    gradeLevel: 10,
    subject: "History",
    title: "Colonialism and Its Legacy",
    content:
      "European colonialism, which reached its zenith in the 19th and early 20th centuries, profoundly reshaped the political, economic, and cultural landscapes of Africa, Asia, the Americas, and Oceania. Driven by the pursuit of raw materials, new markets, and strategic advantage, European powers partitioned vast territories and subjected indigenous populations to foreign rule, exploitation, and cultural suppression. The Berlin Conference of 1884-1885 formalized the carving of Africa among European powers with minimal regard for existing ethnic, linguistic, and political boundaries. Colonial economic structures were extractive by design, channeling resources and profits to metropolitan centers while leaving colonies underdeveloped and dependent. The transatlantic slave trade, a cornerstone of early colonial capitalism, forcibly displaced and enslaved millions of Africans, with devastating and multigenerational consequences for both African and diasporic communities. Colonial education systems systematically denigrated indigenous knowledge, languages, and traditions, imposing European values as markers of civilization and progress. Resistance movements, from armed uprisings to intellectual and political organizing, challenged colonial authority throughout the colonial period. Decolonization accelerated after World War II, as weakened European powers faced mounting nationalist movements and international pressure. Between 1945 and 1975, dozens of nations across Asia and Africa achieved independence, often after protracted struggles. However, formal political independence did not automatically dismantle colonial economic structures, and many newly independent nations found themselves locked into unequal trade relationships with former colonizers. Structural adjustment programs imposed by international financial institutions in the 1980s perpetuated cycles of debt and dependency. Ethnic conflicts in post-colonial states were frequently inflamed by artificially drawn borders that grouped rival communities or divided cohesive ones. Post-colonial theory, developed by scholars like Frantz Fanon, Edward Said, and Chinua Achebe, examines how colonial legacies continue to shape identity, culture, and power. Reparations debates, cultural restitution of looted artifacts, and truth and reconciliation processes are among the contemporary responses to colonial history. Grappling honestly with the full legacy of colonialism remains essential for building equitable international relations and addressing persistent global inequalities.",
  },
  {
    id: 30,
    gradeLevel: 10,
    subject: "Geography",
    title: "Climate Change and Environmental Policy",
    content:
      "Climate change, driven primarily by anthropogenic greenhouse gas emissions from fossil fuel combustion, deforestation, and industrial agriculture, represents one of the most complex and consequential challenges confronting contemporary civilization. The atmospheric concentration of carbon dioxide has risen from approximately 280 parts per million in the pre-industrial era to over 420 parts per million today, a level unprecedented in at least 800,000 years of ice core records. This accumulation of greenhouse gases intensifies the natural greenhouse effect, trapping additional heat in the lower atmosphere and driving a cascade of environmental consequences. Global average temperatures have risen by approximately 1.1 degrees Celsius above pre-industrial baselines, with warming proceeding faster at the poles than at lower latitudes. Arctic sea ice extent has declined precipitously, and mountain glaciers worldwide are retreating at accelerating rates, threatening freshwater supplies for hundreds of millions of people. Rising ocean temperatures are bleaching coral reef ecosystems and intensifying tropical cyclones by providing more thermal energy to developing storm systems. Sea-level rise resulting from thermal expansion of seawater and melting ice sheets threatens low-lying coastal nations and megacities. Extreme weather events including droughts, floods, heatwaves, and wildfires are becoming more frequent and severe, displacing populations and straining economies. The Paris Agreement of 2015 marked a landmark diplomatic achievement, committing nearly every nation to limiting warming to well below 2 degrees Celsius above pre-industrial levels. However, nationally determined contributions under the agreement have been insufficient to meet these targets, and enforcement mechanisms remain weak. Climate justice advocates emphasize that the nations and communities least responsible for emissions are often most vulnerable to climate impacts, raising profound questions of equity and responsibility. Carbon pricing mechanisms, including carbon taxes and emissions trading schemes, aim to internalize the social cost of carbon into market decisions. Renewable energy technologies, particularly solar and wind power, have achieved dramatic cost reductions and are displacing fossil fuels in electricity generation across many markets. Nature-based solutions, such as restoring forests, wetlands, and mangroves, offer cost-effective carbon sequestration alongside biodiversity and ecosystem benefits. The transition to a net-zero global economy requires not only technological innovation but profound transformations in governance, financial systems, and social norms.",
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
