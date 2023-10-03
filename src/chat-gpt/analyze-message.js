const { Command } = require('commander');
const { OpenAI } = require('openai');

const program = new Command();
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

async function analyzeMessage(message) {
    try {
        const prompt = `Analyze the sentiment and intent of the following message:\n"${message}"\nSentiment:`;

        const completion = await openai.completions.create({
            model: 'gpt-3.5-turbo-instruct',
            prompt,
            max_tokens: 50,
        });

        const analysisResult = completion.choices[0].text;

        return analysisResult;
    } catch (error) {
        console.error('Error:', error.message);
        throw new Error('Failed to analyze the message');
    }
}
program
    .command('analyze <message>')
    .description('Analyze a message using AI')
    .action(async (message) => {
        try {
            const analysisResult = await analyzeMessage(message);

            console.log('Analysis Result:');
            console.log(analysisResult);
        } catch (error) {
            console.error('Error:', error.message);
        }
    });

program.parse(process.argv);


