import { Express } from 'express';

import { connectDB } from './config/db';
import { createApp } from './app';
import { env } from './config/environment';
import { seedAdmin } from './config/seed';

async function main() {
    await connectDB();
    if (env.seedAdmin == 'true') {
        await seedAdmin();
    }

    const app: Express = createApp();
    app.listen(env.port, () => {
        console.log(`Server running on port ${env.port}`);
    });
}

main().catch((err) => {
    console.error('Failed to start server', err);
    process.exit(1);
});
