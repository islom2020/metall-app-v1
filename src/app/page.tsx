"use client";

import { ModeToggle } from "@/components/ui/mode-toggle";
import { LanguageParam } from "@/types/ui";
import { NumberParam, useQueryParam } from "use-query-params";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { Link } from "react-scroll";

import SearchBar from "./_components/search-bar";
import List from "./_components/list";

export default async function Home({ params: { lng } }: LanguageParam) {
  const [id] = useQueryParam("id", NumberParam);
  return (
    <main>
      <nav className="flex h-[60px] sticky z-50 top-0 border-b gap-2 bg-primary items-center px-4 justify-between dark:bg-[#020817]">
        <SearchBar />
        {id && (
          <Link
            activeClass="active"
            to={`${id}`}
            spy={true}
            smooth={true}
            offset={-60}
            duration={500}
            className="cursor-pointer flex gap-2 items-center justify-center bg-white dark:bg-slate-600 transition-all dua hover:bg-slate-300 rounded-md p-2 h-[35px]"
          >
            {id}
            <ArrowLeftIcon
              fontSize={14}
              width={16}
              height={16}
              className="-rotate-90"
            />
          </Link>
        )}
        <div className="flex gap-2">
          <ModeToggle />
        </div>
      </nav>
      <div>
        <List />
      </div>
    </main>
  );
}
