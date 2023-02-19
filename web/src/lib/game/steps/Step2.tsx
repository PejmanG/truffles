import { useState } from "react";
import Image from "next/image";
import { classed } from "@tw-classed/react"
import sample from "lodash/sample";
import Sheet from "react-modal-sheet";
import { useIsDesktop } from "~/utils/useIsDesktop";
import { Instruction } from "~/lib/game/components/Instruction";
import { Question } from "~/lib/game/components/Question";
import { Answer } from "~/lib/game/components/Answer";
import {
  Player,
  PlayersGrid,
  NextButton,
} from "~/lib/game/components/PlayerGrid";
import { AnimationSprite } from "~/components";
import { useTimeout } from "~/utils/useTimeout";
import { useNextStep } from "~/lib/game/useGameActions";
import type { StepProps } from "~/lib/game/steps/types";

const sprites = {
  correct: ["wineGlassClinking", "checkMark", "bubbleLike"],
  wrong: ["crossMark", "bubbleCryEmoji"],
};

const Step2Play = ({
  gameId,
  gameState,
  players,
  playerName,
  playerId,
}: StepProps) => {
  const desktop = useIsDesktop();
  const { nextStep, isLoading } = useNextStep();
  const [showSubmissions, setShowSubmissions] = useState(false);
  const [animationSpriteName, setAnimationSpriteName] = useState<any>(null);

  const [firstPlayer] = players;
  const correctAnswer = gameState.sceneAnswers.find(
    (sceneAnswer) => sceneAnswer.isCorrect
  )!;

  useTimeout(() => {
    const isCurrentPlayerCorrect =
      gameState.submissions.find((s) => s.playerId === playerId)?.isCorrect ||
      false;

    if (isCurrentPlayerCorrect) {
      setAnimationSpriteName(sample(sprites.correct));
    } else {
      setAnimationSpriteName(sample(sprites.wrong));
    }
  }, 500);

  useTimeout(() => {
    if (gameState.submissions.length > 1) {
      setShowSubmissions(true);
    }
  }, 2000);

  const handleNextStep = async () => {
    await nextStep(gameId);
  };

  return (
    <>
      {animationSpriteName && <CorrectSprite name={animationSpriteName} />}
      {desktop ? (
        <>
          <AnswerResult gameState={gameState} sceneAnswer={correctAnswer} />
          {showSubmissions && (
            <Submissions gameState={gameState} sceneAnswer={correctAnswer} />
          )}
        </>
      ) : (
        <>
          <AnswerResult
            gameState={gameState}
            sceneAnswer={correctAnswer}
            onAnswerContainerClick={() => setShowSubmissions(true)}
          />
          <StyledSheet
            isOpen={showSubmissions}
            onClose={() => setShowSubmissions(false)}
          >
            <Sheet.Container>
              <Sheet.Content>
                <Submissions
                  gameState={gameState}
                  sceneAnswer={correctAnswer}
                />
              </Sheet.Content>
            </Sheet.Container>
            <button onClick={() => setShowSubmissions(false)}>
              <Sheet.Backdrop />
            </button>
          </StyledSheet>
        </>
      )}
      {firstPlayer && (
        <NextButton
          disabled={firstPlayer.name !== playerName || isLoading}
          onClick={handleNextStep}
          autoFocus
        >
          {firstPlayer.name === playerName
            ? "Next"
            : `Waiting for ${firstPlayer.name}`}
        </NextButton>
      )}
    </>
  );
};

// TODO - make sure the standalone Sheet.[something]s don't affect things
// TODO - make sure the class is being applied correctly
const StyledSheet = classed(Sheet, "!z-[1] [&_.react-modal-sheet-container]:!bg-white dark:[&_.react-modal-sheet-container]:!bg-black");

const Step2Spectate = ({ gameState }: StepProps) => {
  const correctAnswer = gameState.sceneAnswers?.find(
    (sceneAnswer) => sceneAnswer.isCorrect
  )!;

  return (
    <>
      <AnswerResult gameState={gameState} sceneAnswer={correctAnswer} />
      <Submissions gameState={gameState} sceneAnswer={correctAnswer} />
    </>
  );
};

type SubmissionProps = {
  gameState: StepProps["gameState"];
  sceneAnswer: StepProps["gameState"]["sceneAnswers"][0];
  onAnswerContainerClick?: () => void;
};

const AnswerResult = ({
  gameState,
  onAnswerContainerClick,
}: SubmissionProps) => {
  return (
    <>
      <Instruction instruction={gameState.questionDescription} />
      <Question
        question={gameState.question}
        questionType={gameState.questionType}
      />
      <AnswerContainer onClick={onAnswerContainerClick}>
        {gameState.sceneAnswers?.map((sceneAnswer) => (
          <Answer
            key={sceneAnswer.id}
            sceneAnswer={sceneAnswer}
            answerType={gameState.answerType}
            onSubmit={() => {}}
            submitted
            displayMode
          />
        ))}
      </AnswerContainer>
    </>
  );
};

const LocalAnswer=classed(Answer, "");

const AnswerContainer = classed.div(
  "[&_.answer-display]:animate-[bounce-out_1s_forwards]",
  "[&_.answer-display.correct]:animate-none",
  "[&_.answer-display.correct_>_svg]:stroke-green [&_.answer-display.correct_>_svg]:stroke-[5px]",
  "[&_.answer-display.correct_>_svg_path]:animate-[draw-in_0.6s_cubic-bezier(0.7,_0,_0.3,_1)_forwards]",
  "[&_.answer-display.answer-text]:overflow-visible [&_.answer-display.answer-text]:text-center",
  "[&_.answer-display.answer-text]:bg-grey-background dark:[&_.answer-display.answer-text]:bg-grey-dark",
  "[&_.answer-display.answer-text]:pt-6 dark:[&_.answer-display.answer-text]:scale-0",
  "[&_.answer-display.answer-text]:animate-[bounce-in_1s_0.1s_forwards]",
  "[&_.answer-display.answer-text]:before:content-['answer'] [&_.answer-display.answer-text]:before:rounded-wavy",
  "[&_.answer-display.answer-text]:before:absolute [&_.answer-display.answer-text]:before:-top-3",
  "[&_.answer-display.answer-text]:before:left-1/2 [&_.answer-display.answer-text]:before:w-[100px]",
  "[&_.answer-display.answer-text]:before:ml-[-50px] [&_.answer-display.answer-text]:before:py-1",
  "[&_.answer-display.answer-text]:before:rounded [&_.answer-display.answer-text]:before:border-2",
  "[&_.answer-display.answer-text]:before:border-grey-dark dark:[&_.answer-display.answer-text]:before:border-grey-light",
  "[&_.answer-display.answer-text]:before:bg-white dark:[&_.answer-display.answer-text]:before:bg-black",
);

const Submissions = ({ gameState }: SubmissionProps) => {
  const players = gameState.submissions.map((submission) => {
    return (
      <Player
        key={submission.playerId}
        playerName={submission.playerName}
        playerContent={`: "${submission.content}"`}
      >
        {submission.isCorrect && (
          <>
            <div className="correct">
              <Image
                src="/illustrations/correct.svg"
                alt="Correct answer"
                width="50"
                height="70"
              />
            </div>
            <Stars name="blinkingStars2" />
          </>
        )}
      </Player>
    );
  });

  return <SubmissionsContainer>{players}</SubmissionsContainer>;
};

const SubmissionsContainer = classed(
    PlayersGrid,
    "p-5 desktop:py-0 desktop:animate-[fade-up-in_0.8s_cubic-bezier(0.77,_0.1,_0.46,_1.22)_forwards]",
    "[&_.correct]:absolute [&_.correct]:-top-3 [&_.correct]:left-0",
    "[&_.name]:text-center"
  );

const Stars = classed(AnimationSprite, "top-10 desktop:top-5 left-1/2 scale-50 -translate-x-1/2 -translate-y-1/2");

const CorrectSprite = classed(AnimationSprite, "left-1/2 -translate-x-1/2");

export const Step2 = (props: StepProps) => {
  if (props.isSpectate) return <Step2Spectate {...props} />;
  return <Step2Play {...props} />;
};
