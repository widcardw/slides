export default function interpolate<T extends number>(a: T, b: T, alpha: number) {
    if (alpha <= 0)
        return a
    else if (alpha >= 1)
        return b
    return (1 - alpha) * a + alpha * b
}