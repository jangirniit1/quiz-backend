import express from "express";
import Question from "../models/questions.js";

const router = express.Router();

router.post('/addQuestions', async (req, res) => {
    const { category, difficultyLevel, questions } = req.body;

    if (!difficultyLevel) {
        return res.status(400).json({ message: "difficultyLevel is required" });
    }

    try {
        const newQuestion = new Question({
            category,
            difficultyLevel,
            questionArray: questions.map(q => ({
                que: q.que,
                options: q.options,
                answer: q.answer
            }))
        });

        const savedQuestion = await newQuestion.save();
        res.status(201).json(savedQuestion);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.get('/getQuestions', async (req, res) => {
    const { category, difficultyLevel } = req.query;

    try {
        let query = {};
        if (category) {
            query.category = category;
        }
        if (difficultyLevel) {
            query.difficultyLevel = difficultyLevel;
        }

        const questions = await Question.find(query);
        res.status(200).json(questions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;

