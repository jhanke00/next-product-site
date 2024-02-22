# Quiz page

The quiz page offers multiple-choice questions with four options each. Only one question visible at a time in a view. On submit score and the number of questions answered will be stored in respective state value. Instant feedback on the answer and a CTA for navigation to the next question. When all the questions are answered, quiz will gets finished and redirect to results page. On results page final score will be displayed and a CTA for restarting the quiz.

### Folder Structure

- `app/quiz/layout.tsx` - Layout for this feature
- `app/quiz/page.tsx` - Main Page for this feature
- `app/quiz/global.css` - Global style properties and utils
- `app/quiz/ui/components/` - Contain all the components used for this feature
- `app/quiz/ui/icons/` - Feedback icon SVG assets
- `app/quiz/ui/content/content.ts` - Quiz questions and answers JSON content

### Components

#### Button

##### Folder Structure

- `app/quiz/ui/components/Button.tsx`

##### Example Usage

```tsx
import { Button } from 'app/quiz/ui/components/Button.tsx';

// Example
<Button intent={'secondary'} size='small' block className='mt-6'>
  Test
</Button>;
```

#### OptionList

##### Folder Structure

- `app/quiz/ui/components/OptionList.tsx`

##### Example Usage

```tsx
import { OptionList } 'app/quiz/ui/components/OptionList.tsx';

// Example
<OptionList {...OptionListProps} />;
```

#### Result

##### Folder Structure

- `app/quiz/ui/components/Result.tsx`

##### Example Usage

```tsx
import { Result } 'app/quiz/ui/components/Result.tsx';

// Example
<Result {...ResultProps} />;
```

#### Intro Page

##### Folder Structure

- `app/quiz/ui/components/Intro.tsx`

##### Example Usage

```tsx
import { Intro } from 'app/quiz/ui/components/Intro.tsx';

// Example
<Intro />;
```

#### Quiz Page

##### Folder Structure

- `app/quiz/ui/components/Quiz.tsx`

##### Example Usage

```tsx
import { Quiz } 'app/quiz/ui/components/Quiz.tsx';

// Example
<Quiz />
```

### Testing

#### Steps

```tsx

- Install pnpm Globally. You can install pnpm globally on your machine, npm install -g pnpm
- Run pnpm i to install dev dependencies/packages that has been added/used for the quiz feature.
- Run pnpm dev to start application.
- Open http://localhost:3000/quiz with your browser to see the result.

```

#### Storybook

```tsx

- Run pnpm storybook
- Open http://localhost:6006/ with your browser to see the result.

```
