import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between sm:p-24">
      <div className="my-8 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-2 lg:text-left">
      <Image
          src="/avatar.png"
          alt="Oskar Duveborn"
          width={578}
          height={672}
          priority
        />
        <div>
          <h1 className={`sm:mb-3 m-8 text-2xl font-semibold text-left`}>DJ gigs planned so far 2025</h1>
          <ul className="ml-14 list-disc text-left text-orange-300">
            <li>25th January - Syntax Error Season Premiere - 8-bit Special, H62, Stockholm</li>
            <li>1st March - Syntax Error - Board Game Special, H62, Stockholm</li>
            <li>29th March - Syntax Error - Demoscene Special, H62, Stockholm</li>
            <li>18-21st April - Revision, E-werk, Saarbrücken</li>
            <li>26th April - Syntax Error - Anime & Cosplay Special, H62, Stockholm</li>
            <li>31st May - Syntax Error Season Finale - Indie Game Special, H62, Stockholm</li>
            <li>5th June - Security Fest, Elite Park Avenue Hotel, Göteborg</li>
            <li>11th June - Detectify Summer Party, Josefinas Djurgården, Stockholm</li>
            <li>26-28th June - Subkultfestivalen, Vänersborg</li>
            <li>18-20th July - Edison 2025: The Seven Sceners, M/S Borgila, Stockholm</li>
            <li>26th July - Syntax Error Off-The-Grid, Stockholm</li>
            <li>30st August - Syntax Error Season Premiere, H62, Stockholm</li>
            <li>11th September - SEC-T Conference, Münchenbryggeriet, Stockholm</li>
            <li>27th September - Syntax Error, H62, Stockholm</li>
            <li>16th October - Moderskeppet, Birka Gotland, Stockholm</li>
            <li>25th October - Syntax Error - Halloween Special, Stockholm</li>
            <li>29th November - Syntax Error, H62, Stockholm</li>
            <li>13th December - Syntax Error - Xmas Special, H62, Stockholm</li>
          </ul>
        </div>
      </div>

      <div className="my-8 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left">
        <a
          href="https://www.syntax-error.se/"
          className="group px-5 py-4 transition-colors hover:border-gray-300 hover:bg-cyan-100 hover:dark:border-neutral-700 hover:dark:bg-cyan-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={`text-teal-300 sm:mb-3 text-2xl font-semibold`}>
            Syntax Error
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            I&apos;m an organizer, the treasurer, a promoter and a DJ at the hon-profit nightclub in Sweden promoting video game music and a friendly environment. I also designed and developed the current website.
          </p>
        </a>

        <a
          href="https://www.sec-t.org/"
          className="group px-5 py-4 transition-colors hover:border-gray-300 hover:bg-cyan-100 hover:dark:border-neutral-700 hover:dark:bg-cyan-800 hover:dark:bg-opacity-30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={`text-teal-300 sm:mb-3 text-2xl font-semibold`}>
            SEC-T
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            I&apos;m the Club Manager and promoter for the large cyber security conference SEC-T in Stockholm where I get to organize slightly bigger concerts and cyberpunk-themed entertainment each year.
          </p>
        </a>

        <a
          href="https://mandagsklubben.net/"
          className="group px-5 py-4 transition-colors hover:border-gray-300 hover:bg-cyan-100 hover:dark:border-neutral-700 hover:dark:bg-cyan-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={`text-teal-300 sm:mb-3 text-2xl font-semibold`}>
            Måndagsklubben
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            I&apos;m a founder and an organizer of the weekly tech afterwork in Stockholm called Måndagsklubben which has been around for 12+ years on basically every Monday.
          </p>
        </a>

        <a
          href="https://fuzzycats.se"
          className="group px-5 py-4 transition-colors hover:border-gray-300 hover:bg-cyan-100 hover:dark:border-neutral-700 hover:dark:bg-cyan-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={`text-teal-300 sm:mb-3 text-2xl font-semibold`}>
            Fuzzycats
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50 text-balance`}>
            I&apos;m the DJ in the DJ+VJ duo Fuzzycats who believes Big Beat is ripe for a comeback. We&apos;re playing that 90:s big beat and break beat music that you instantly love and is particularily fitting for hacking and computer technology events.
          </p>
        </a>
      </div>

      <div className="my-8 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left">
        <a
          href="https://www.linkedin.com/in/duveborn/"
          className="group px-5 py-4 transition-colors hover:border-gray-300 hover:bg-cyan-100 hover:dark:border-neutral-700 hover:dark:bg-cyan-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={`sm:mb-3 text-2xl font-semibold`}>
            LinkedIn
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            Contact me for collaborations and other ideas.
          </p>
        </a>

        <a
          href="https://github.com/duveborn"
          className="group px-5 py-4 transition-colors hover:border-gray-300 hover:bg-cyan-100 hover:dark:border-neutral-700 hover:dark:bg-cyan-800 hover:dark:bg-opacity-30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={`sm:mb-3 text-2xl font-semibold`}>
            Github
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            Check out my public repositories and organizations.
          </p>
        </a>

        <a
          href="https://www.instagram.com/oskarduveborn/"
          className="group px-5 py-4 transition-colors hover:border-gray-300 hover:bg-cyan-100 hover:dark:border-neutral-700 hover:dark:bg-cyan-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={`sm:mb-3 text-2xl font-semibold`}>
            Instagram
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            Enjoy my casual photo vlogging..
          </p>
        </a>

        <a
          href="https://twitter.com/OskarDuveborn"
          className="group px-5 py-4 transition-colors hover:border-gray-300 hover:bg-cyan-100 hover:dark:border-neutral-700 hover:dark:bg-cyan-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={`sm:mb-3 text-2xl font-semibold`}>
            X
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50 text-balance`}>
            Message me for collaborations or other ideas.
          </p>
        </a>
      </div>
    </main>
  );
}
