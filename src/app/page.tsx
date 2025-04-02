import Link from "next/link";
import InstallApp from "./components/InstallApp";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-center max-w-4xl">
        <h1 className="text-4xl font-bold text-center">Obose &amp; Unwana&apos;s Wedding</h1>
        <p className="text-xl text-center">We&apos;re getting married! Join us for our special day.</p>
        
        <div className="text-center my-8">
          <p className="text-lg">Saturday, April 12, 2025</p>
          <p className="text-lg">1:00 PM</p>
          <p className="text-lg">Flairmore Event Center</p>
          <p className="text-lg">Uyo, Nigeria</p>
        </div>
        
        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <Link
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
            href="/program"
          >
            View Wedding Program
          </Link>
        </div>
        
        <InstallApp />
      </main>
      <footer className="row-start-3 text-center">
        <p className="text-sm text-gray-500">Made with love by the happy couple</p>
      </footer>
    </div>
  );
}
