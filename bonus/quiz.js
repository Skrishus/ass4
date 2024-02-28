const { Questions } = require("../database/mongo");

class Quiz {
    static async getQuestions(req, res) {
        try {
            const questions = await Questions.find();
            const user = req.session.user;
            return res.render("quiz.ejs", { questions, user });
        } catch (error) {
            console.error("[Error] Failed to fetch questions from database, error: ", error);
            return res.status(500).send("[Error] Failed to fetch questions.");
        }
    }

    static async postAnswers(req, res) {
        const answers = req.body;
        let score = 0;
        const questions = await Questions.find();

        questions.forEach((question) => {
            if (answers[`question${question._id}`] === question.correctAnswer) {
                score++;
            }
        });

        const user = req.session.user;
        return res.render("quizResult.ejs", { score, user, timeLeft: answers.timeLeft < 0 ? -1 : answers.timeLeft });
    }
}

module.exports = { Quiz };
