const { execSync } = require('child_process');
try {
    execSync('npx prisma generate', { stdio: 'pipe' });
    console.log('Success');
} catch (e) {
    require('fs').writeFileSync('err.json', JSON.stringify({ stdout: e.stdout?.toString(), stderr: e.stderr?.toString(), message: e.message }));
}
