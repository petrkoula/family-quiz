// Quiz Data - Local-first embedded data
// Images will be lazy-loaded from /images/ folder
export const quizData = [
  {
    image: "IMG_4246_1.jpg",
    questions: [
      {
        text: "Který módní prvek křičí '70. léta cool'?",
        options: ["Kožená bunda", "Zvonové kalhoty", "Boty na platformě", "Disco koule"],
        correct: 0
      },
      {
        text: "Ty kníry by se daly nejlépe popsat jako:",
        options: ["Sotva viditelné", "Legendární", "Ironický hipster", "Náhodné"],
        correct: 1
      },
      {
        text: "Co chybí této klasické póze?",
        options: ["Sluneční brýle", "Cigareta", "Kytara", "Nic - je to dokonalé"],
        correct: 3
      }
    ]
  },
  {
    image: "IMG_4246_2.jpg",
    questions: [
      {
        text: "Kolik miminek je na gauči?",
        options: ["Jedno hodně široké", "Dvě roztomilá miminka", "Tři maličká miminka", "Sněm miminek"],
        correct: 1
      },
      {
        text: "Co si tato miminka myslí?",
        options: ["Kdy je svačina?", "Proč jsme napůl nazí?", "Je to fotka?", "Všechno výše uvedené"],
        correct: 3
      },
      {
        text: "Které miminko vypadá víc překvapeně?",
        options: ["Levé miminko", "Pravé miminko", "Obě stejně šokovaná", "Ani jedno - jsou profíci"],
        correct: 1
      }
    ]
  },
  {
    image: "IMG_4246_3.jpg",
    questions: [
      {
        text: "Co má toto batole na sobě?",
        options: ["Designový outfit", "Bílé pyžamo/oblečení", "Kostým superhrdiny", "Svatební šaty"],
        correct: 1
      },
      {
        text: "Výraz tohoto dítěte říká:",
        options: ["Něco kuju", "Kde je svačina?", "Chyceno uprostřed myšlenky", "Budoucí modelka"],
        correct: 2
      },
      {
        text: "Z jakého desetiletí je tahle fotka?",
        options: ["1950", "1960-70", "1980", "1990"],
        correct: 1
      }
    ]
  }
  // Additional 20 photos would be added here...
  // For production, import all quiz data from parent ../app.js or separate data file
]

// Helper function to get image URL
// Local-first: images are in public/images or referenced from parent /images
export function getImageUrl(imageName) {
  // During development, reference parent images folder
  return `/images/${imageName}`
}
