# Quiz page

[Vercel URL](https://next-product-site-xi.vercel.app/quiz)

Feature built against Issue Reference [#13 A Quiz](https://github.com/jhanke00/next-product-site/issues/13)

### Scope definition

- A quiz to test the users' knowledge by showing multiple choices against each question.
- The quiz starts on button press 'Start a quiz', and progresses by showing one question at a time providing multiple choices to select for each question.
- A question can only be answered once
- On selection of correct answer, the selected option turns green
- On selection of incorrect answer, the selected option turns red and the correct answer is highlilghted in green
- On selection of answer, additional information related to that question is showed.
- The Next and Previous buttons are shown conditionally based on the index of the question.
- After answering the last question 'Check score' button is provided to show the Summary of the quiz.
- The summary of the quiz provides information about number of correct answers provided, final score and lists all the questions and options with selected and correct answers marked appropriately.
- Reset button can be pressed at any stage after starting the quiz

## Incoming Files

#### Page

[`pages/quiz/index.tsx`](/pages/quiz/index.tsx) - Feature page<br/>

#### Components

[`/components/QuizIntro/index.tsx`](/components/QuizIntro/index.tsx) - Intro Component<br/>
[`/components/Questionnaire/index.tsx`](/components/Questionnaire/index.tsx) - Questionnaire Component<br/>
[`/components/Summary/index.tsx`](/components/Summary/index.tsx) - Summary Component

#### Quiz Questionnaire Data

[`/components/QuizIntro/index.tsx`](/data/questions.js) - Questionnaire Data

#### Document

[`index.md`](/docs/frontend/quiz/index.md) - Questionnaire Data

## Components Usage

Question Data an Components are imported to the Quiz Page

```tsx
import questionData from '../../data/questions';
import QuizIntro from '../../components/QuizIntro';
import Summary from '../../components/Summary';
import Questionnaire from '../../components/Questionnaire';
```

Components are conditionally rendered based on the state (quizDisplay) designated for components swap

```tsx
{
    intro:(
        <QuizIntro ...props/>
    ),
    quiz:(
        <Questionnaire ...props/>
    ),
    summary:(
        <Summary ...props/>
    )
}[quizDisplay]
```

## Quiz Handle

The question data loaded initially is set to a state (questions), and the answer interaction from the user is updated to the state.

```tsx
const handleAnswer = (questionID: number, option: any) => {
  const handleQuestions = questions.map((question: any, index: number) => {
    if (question.id == questionID) {
      return {
        ...question,
        isAnswered: true,
        answeredCorrect: option.isAnswer ? true : false,
        selectionIndex: option.id,
      };
    } else {
      return question;
    }
  });
  setQuestions(handleQuestions);
};
```

## Screens

- [Intro](/docs/frontend/quiz/screenshots/1.jpg)
- [Quiz 1](/docs/frontend/quiz/screenshots/2.jpg)
- [Quiz 2](/docs/frontend/quiz/screenshots/3.jpg)
- [Quiz 3](/docs/frontend/quiz/screenshots/4.jpg)
- [Quiz 4](/docs/frontend/quiz/screenshots/5.jpg)
- [Quiz 5](/docs/frontend/quiz/screenshots/6.jpg)
- [Summary](/docs/frontend/quiz/screenshots/7.jpg)
