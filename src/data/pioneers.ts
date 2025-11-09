export type Pioneer = {
  id: string;
  name: string;
  title: string;
  project: string;
  focusAreas: string[];
  location: {
    city: string;
    country: string;
    lat: number;
    lng: number;
  };
  website?: string;
};

export const pioneers: Pioneer[] = [
  {
    id: "wangari-maathai",
    name: "Wangari Maathai",
    title: "Environmentalist, Nobel Laureate",
    project: "Green Belt Movement",
    focusAreas: ["Environment", "Reforestation", "Women's Rights"],
    location: { city: "Nairobi", country: "Kenya", lat: -1.286389, lng: 36.817223 },
    website: "https://www.greenbeltmovement.org/",
  },
  {
    id: "malala-yousafzai",
    name: "Malala Yousafzai",
    title: "Education Activist, Nobel Laureate",
    project: "Malala Fund",
    focusAreas: ["Education", "Girls' Rights"],
    location: { city: "Mingora", country: "Pakistan", lat: 34.7717, lng: 72.3600 },
    website: "https://malala.org/",
  },
  {
    id: "marie-curie",
    name: "Marie Curie",
    title: "Physicist and Chemist, Nobel Laureate",
    project: "Research on Radioactivity",
    focusAreas: ["Science", "Medicine"],
    location: { city: "Paris", country: "France", lat: 48.8566, lng: 2.3522 },
  },
  {
    id: "ada-lovelace",
    name: "Ada Lovelace",
    title: "Mathematician, Pioneer of Computing",
    project: "Analytical Engine Notes",
    focusAreas: ["Computing", "Mathematics"],
    location: { city: "London", country: "United Kingdom", lat: 51.5074, lng: -0.1278 },
  },
  {
    id: "grace-hopper",
    name: "Grace Hopper",
    title: "Computer Scientist, Rear Admiral",
    project: "COBOL and Compiler Innovation",
    focusAreas: ["Computing", "Programming Languages"],
    location: { city: "New York", country: "United States", lat: 40.7128, lng: -74.006 },
  },
  {
    id: "katherine-johnson",
    name: "Katherine Johnson",
    title: "Mathematician, NASA",
    project: "Orbital Mechanics for Spaceflight",
    focusAreas: ["Space", "Mathematics"],
    location: { city: "Hampton", country: "United States", lat: 37.0299, lng: -76.3452 },
  },
  {
    id: "rosalind-franklin",
    name: "Rosalind Franklin",
    title: "Chemist and X-ray Crystallographer",
    project: "DNA Structure Research",
    focusAreas: ["DNA", "Biophysics"],
    location: { city: "London", country: "United Kingdom", lat: 51.5074, lng: -0.1278 },
  },
  {
    id: "ellen-johnson-sirleaf",
    name: "Ellen Johnson Sirleaf",
    title: "Stateswoman, Nobel Laureate",
    project: "Democratic Governance and Women's Leadership",
    focusAreas: ["Leadership", "Governance", "Women's Rights"],
    location: { city: "Monrovia", country: "Liberia", lat: 6.3156, lng: -10.8074 },
  },
  {
    id: "shirin-ebadi",
    name: "Shirin Ebadi",
    title: "Lawyer, Nobel Laureate",
    project: "Human Rights Advocacy",
    focusAreas: ["Human Rights", "Law", "Women's Rights"],
    location: { city: "Tehran", country: "Iran", lat: 35.6892, lng: 51.389 },
  },
  {
    id: "tu-youyou",
    name: "Tu Youyou",
    title: "Pharmacologist, Nobel Laureate",
    project: "Discovery of Artemisinin",
    focusAreas: ["Medicine", "Malaria"],
    location: { city: "Beijing", country: "China", lat: 39.9042, lng: 116.4074 },
  },
  {
    id: "maryam-mirzakhani",
    name: "Maryam Mirzakhani",
    title: "Mathematician, Fields Medalist",
    project: "Riemann Surfaces and Moduli Spaces",
    focusAreas: ["Mathematics", "Science"],
    location: { city: "Stanford", country: "United States", lat: 37.4275, lng: -122.1697 },
  },
  {
    id: "hedy-lamarr",
    name: "Hedy Lamarr",
    title: "Inventor and Actress",
    project: "Frequency-Hopping Spread Spectrum",
    focusAreas: ["Telecommunications", "Innovation"],
    location: { city: "Vienna", country: "Austria", lat: 48.2082, lng: 16.3738 },
  },
  {
    id: "ada-yonath",
    name: "Ada Yonath",
    title: "Crystallographer, Nobel Laureate",
    project: "Ribosome Structure",
    focusAreas: ["Chemistry", "Biology"],
    location: { city: "Jerusalem", country: "Israel", lat: 31.7683, lng: 35.2137 },
  },
  {
    id: "ngozi-okonjo-iweala",
    name: "Ngozi Okonjo-Iweala",
    title: "Economist, WTO Director-General",
    project: "Global Trade and Development",
    focusAreas: ["Economics", "Trade", "Leadership"],
    location: { city: "Geneva", country: "Switzerland", lat: 46.2044, lng: 6.1432 },
  },
];
