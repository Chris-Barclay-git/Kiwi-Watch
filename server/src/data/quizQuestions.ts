// The shape of one starter quiz question.
export interface QuizQuestionSeed {
  topic: string
  text: string
  explanation: string // shown after the user answers
  options: { text: string; isCorrect: boolean }[]
}

// The questions the quiz starts with. Based on advice from NZ Civil Defence and MetService.
export const QUIZ_QUESTIONS: QuizQuestionSeed[] = [
  {
    topic: 'earthquakes',
    text: "An earthquake starts and you're indoors. What should you do?",
    explanation:
      "Drop to the ground, take Cover under a sturdy table or desk, and Hold on until the shaking stops. Don't run outside: falling objects are the biggest danger.",
    options: [
      { text: 'Drop, Cover and Hold', isCorrect: true },
      { text: 'Run outside as fast as you can', isCorrect: false },
      { text: 'Stand in a doorway', isCorrect: false },
      { text: 'Get into the lift', isCorrect: false },
    ],
  },
  {
    topic: 'tsunami',
    text: "You're at the beach and feel an earthquake that is long or strong. What should you do?",
    explanation:
      'Long or Strong, Get Gone. If the shaking lasts more than a minute, or is too strong to stand up in, a tsunami can arrive very quickly. Move to high ground or inland straight away, without waiting for an official warning.',
    options: [
      { text: 'Wait for a siren or official warning first', isCorrect: false },
      {
        text: 'Walk down to the water to see if it is pulling back',
        isCorrect: false,
      },
      { text: 'Move straight to high ground or inland', isCorrect: true },
      { text: 'Drive home along the coast', isCorrect: false },
    ],
  },
  {
    topic: 'emergencies',
    text: 'What number do you call in a life-threatening emergency in New Zealand?',
    explanation:
      '111 connects you to police, fire and ambulance. Save it for real emergencies.',
    options: [
      { text: '911', isCorrect: false },
      { text: '111', isCorrect: true },
      { text: '999', isCorrect: false },
      { text: '000', isCorrect: false },
    ],
  },
  {
    topic: 'supplies',
    text: 'After a disaster, what is the minimum time Civil Defence says your household should be able to look after itself?',
    explanation:
      'Help can take a while to reach you, so Civil Defence recommends food, water and other supplies for at least three days. More is better if you can manage it.',
    options: [
      { text: '6 hours', isCorrect: false },
      { text: '1 day', isCorrect: false },
      { text: '3 days', isCorrect: true },
      { text: '2 weeks', isCorrect: false },
    ],
  },
  {
    topic: 'weather',
    text: 'What is the difference between a Watch and a Warning from MetService?',
    explanation:
      'A Watch means severe weather is possible, so stay alert and keep checking. A Warning means it is expected or happening, so it is time to act. The colour (yellow, orange or red) shows how severe it is.',
    options: [
      {
        text: 'A Watch means it is over, a Warning means it is still going',
        isCorrect: false,
      },
      {
        text: 'A Watch means severe weather is possible, a Warning means it is expected',
        isCorrect: true,
      },
      {
        text: 'A Watch is for rain only, a Warning is for wind only',
        isCorrect: false,
      },
      { text: 'There is no difference', isCorrect: false },
    ],
  },
  {
    topic: 'earthquakes',
    text: 'What does the intensity (MMI) number on a quake tell you?',
    explanation:
      'Intensity describes how strongly the shaking was felt at a place. Magnitude is different: it measures the energy released at the quake itself.',
    options: [
      { text: 'How deep the quake was', isCorrect: false },
      { text: 'How much energy the quake released', isCorrect: false },
      { text: 'How long the shaking lasted', isCorrect: false },
      { text: 'How strongly the shaking was felt', isCorrect: true },
    ],
  },
  {
    topic: 'communication',
    text: 'The power and mobile networks are down. What is the most reliable way to hear official updates?',
    explanation:
      "A radio keeps working when power and mobile networks don't. Keep a battery or wind-up radio, and spare batteries, in your emergency kit.",
    options: [
      { text: 'Social media on your phone', isCorrect: false },
      { text: 'Email', isCorrect: false },
      { text: 'A battery or wind-up radio', isCorrect: true },
      { text: 'Streaming video', isCorrect: false },
    ],
  },
  {
    topic: 'floods',
    text: 'You come to a flooded road. What should you do?',
    explanation:
      "If it's flooded, forget it. Even shallow floodwater can hide damage in the road and can sweep a vehicle away. Turn around and find another way.",
    options: [
      { text: 'Drive through slowly if it looks shallow', isCorrect: false },
      { text: 'Drive through if you have a 4WD', isCorrect: false },
      { text: 'Follow the car in front', isCorrect: false },
      { text: 'Never drive or walk through it. Turn around', isCorrect: true },
    ],
  },
]
