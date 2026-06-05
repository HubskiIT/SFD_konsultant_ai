import { streamText } from 'ai';

async function main() {
    try {
        const result = streamText({
            model: { id: 'mock', provider: 'mock' },
            messages: [{ role: 'user', content: 'hello' }],
        });
        
        console.log(Object.keys(result));
        process.exit(0);
    } catch (e) {
        console.error(e);
    }
}
main();
