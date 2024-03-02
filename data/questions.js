const questions = [
  {
    id: '1',
    questionText: 'What is the 4th letter of the Greek alphabet?',
    options: [
      {
        id: '1',
        text: 'Alpha',
      },
      {
        id: '2',
        text: 'Beta',
      },
      {
        id: '3',
        text: 'Gamma',
      },
      {
        id: '4',
        text: 'Delta',
        isAnswer: 'true',
      },
    ],
    feedback:
      'Delta is the fourth letter of the Greek alphabet. In the system of Greek numerals it has a value of 4. It was derived from the Phoenician letter dalet. Letters that come from delta include Latin D and Cyrillic Д.',
    answeredCorrect: false,
    selectionIndex: 0,
  },
  {
    id: '2',
    questionText: "What company was initially known as 'Blue Ribbon Sports'?",
    options: [
      {
        id: '1',
        text: 'Nike',
        isAnswer: 'true',
      },
      {
        id: '2',
        text: 'Reebok',
      },
      {
        id: '3',
        text: 'Puma',
      },
      {
        id: '4',
        text: 'Woodland',
      },
    ],
    feedback:
      'Nike, originally known as Blue Ribbon Sports (BRS), was founded by University of Oregon track athlete Phil Knight and his coach, Bill Bowerman, on January 25, 1964.',
    answeredCorrect: false,
    selectionIndex: 0,
  },
  {
    id: '3',
    questionText: 'What country has the highest life expectancy?',
    options: [
      {
        id: '1',
        text: 'Honk Kong',
      },
      {
        id: '2',
        text: 'Monaco',
        isAnswer: 'true',
      },
      {
        id: '3',
        text: 'Australia',
      },
      {
        id: '4',
        text: 'Indonesia',
      },
    ],
    feedback:
      'Monaco had the highest life expectancy among both men and women worldwide as of 2023. That year, life expectancy for men and women was 84 and 89 years, respectively.',
    answeredCorrect: false,
    selectionIndex: 0,
  },
  {
    id: '4',
    questionText: 'Who has won the most total Academy Awards?',
    options: [
      {
        id: '1',
        text: 'James Cameroon',
      },
      {
        id: '2',
        text: 'Steven Spielberg',
      },
      {
        id: '3',
        text: 'Walt Disney',
        isAnswer: 'true',
      },
      {
        id: '4',
        text: 'Brad Pit',
      },
    ],
    feedback:
      'As of 2023, Disney has won a total of 145 Academy Awards, but the impressive number is that of these, 32 were won by Walt Disney personally.',
    answeredCorrect: false,
    selectionIndex: 0,
  },
  {
    id: '5',
    questionText: 'What country drinks the most coffee per capita?',
    options: [
      {
        id: '1',
        text: 'USA',
      },
      {
        id: '2',
        text: 'India',
      },
      {
        id: '3',
        text: 'Finland',
        isAnswer: 'true',
      },
      {
        id: '4',
        text: 'Mexico',
      },
    ],
    feedback:
      'Fins consume a whopping 12 kilograms (about 26 pounds) of coffee per capita annually, making Finland the biggest consumer of coffee on earth.',
    answeredCorrect: false,
    selectionIndex: 0,
  },
];

export default questions;
