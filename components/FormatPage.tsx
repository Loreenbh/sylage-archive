export default function FormatPage( { children }) {
    return (
        <main className="relative w-[650px] h-[900px] bg-white shadow-3xl 
        bg-gradient-to-b from-white via-zinc-100 to-zinc-200 p-5 flex flex-col
        ">
            {children}
        </main>
    )
}