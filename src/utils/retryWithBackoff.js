const restriesBackoff = async (fn, retries = 3, delay = 1000) => {
    try {
        return await fn();
    } catch (error) {
        if (retries > 0) {
            console.warn(`Operation failed. Retrying in ${delay}ms... (${retries} retries left)`);
            await new Promise(res => setTimeout(res, delay));
            return restriesBackoff(fn, retries - 1, delay * 2);
        } else {
            console.error('Operation failed after all retries:', error);
            throw error;
        }
    }
}
module.exports = restriesBackoff;