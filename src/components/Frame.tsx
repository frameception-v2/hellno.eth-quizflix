"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { useFrameSDK } from "~/hooks/useFrameSDK";
import { PROJECT_TITLE } from "~/lib/constants";

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

// Quiz questions based on hellno's recent casts
const quizQuestions: QuizQuestion[] = [
  {
    question: "What is hellno working on according to recent casts?",
    options: [
      "A new NFT collection",
      "A Farcaster miniapp called vibes.engineering",
      "A Twitter alternative",
      "A DeFi protocol"
    ],
    correctAnswer: 1
  },
  {
    question: "What article did hellno share about personal productivity?",
    options: [
      "The Productivity Trap",
      "Jevons Paradox: A personal perspective",
      "AI and the Future of Work",
      "How to Build in Public"
    ],
    correctAnswer: 1
  }
];

interface QuizCardProps {
  currentQuestion: number;
  selectedOption: number | null;
  onSelectOption: (index: number) => void;
  onNextQuestion: () => void;
  isLastQuestion: boolean;
  showResults: boolean;
  score: number;
  totalQuestions: number;
}

function QuizCard({ 
  currentQuestion, 
  selectedOption, 
  onSelectOption, 
  onNextQuestion,
  isLastQuestion,
  showResults,
  score,
  totalQuestions
}: QuizCardProps) {
  const question = quizQuestions[currentQuestion];

  if (showResults) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Quiz Results</CardTitle>
          <CardDescription>
            Thanks for playing!
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <div className="text-2xl font-bold mb-4">
            Your Score: {score}/{totalQuestions}
          </div>
          <div className="text-sm">
            {score === totalQuestions 
              ? "Perfect score! You&apos;re a true hellno fan!" 
              : "Thanks for playing! Check out more casts from hellno."}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Question {currentQuestion + 1}</CardTitle>
        <CardDescription>
          {question.question}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-2">
          {question.options.map((option, index) => (
            <Button
              key={index}
              variant={selectedOption === index ? "default" : "outline"}
              className="justify-start text-left"
              onClick={() => onSelectOption(index)}
            >
              {option}
            </Button>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={onNextQuestion} 
          disabled={selectedOption === null}
          className="w-full"
        >
          {isLastQuestion ? "See Results" : "Next Question"}
        </Button>
      </CardFooter>
    </Card>
  );
}

export default function Frame() {
  const { isSDKLoaded } = useFrameSDK();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const handleSelectOption = (index: number) => {
    setSelectedOption(index);
  };

  const handleNextQuestion = () => {
    // Check if answer is correct and update score
    if (selectedOption === quizQuestions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }

    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(null);
    } else {
      setShowResults(true);
    }
  };

  if (!isSDKLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-[300px] mx-auto py-2 px-2">
      <div className="mb-4 text-center">
        <h1 className="text-xl font-bold">{PROJECT_TITLE} Quiz</h1>
        <p className="text-sm text-gray-500">Test your knowledge about hellno's recent casts</p>
      </div>
      
      <QuizCard
        currentQuestion={currentQuestion}
        selectedOption={selectedOption}
        onSelectOption={handleSelectOption}
        onNextQuestion={handleNextQuestion}
        isLastQuestion={currentQuestion === quizQuestions.length - 1}
        showResults={showResults}
        score={score}
        totalQuestions={quizQuestions.length}
      />
    </div>
  );
}
