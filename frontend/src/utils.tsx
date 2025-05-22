const DELAY_MS = 1000;

const WorkWithMinDelay = async <T,>(work: Promise<T>): Promise<T> => {
    const delay = new Promise((r) => setTimeout(r, DELAY_MS));
    const result = await Promise.all([work, delay]);
    return result[0] as T;
}

export { WorkWithMinDelay };