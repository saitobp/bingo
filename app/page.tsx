"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type BandToken = {
  bg: string;
  glow: string;
  letter: string;
};

const BINGO_BANDS: BandToken[] = [
  {
    bg: "from-sky-500 via-sky-400 to-sky-300",
    glow: "shadow-sky-400/40",
    letter: "B",
  },
  {
    bg: "from-blue-500 via-blue-400 to-blue-300",
    glow: "shadow-blue-400/40",
    letter: "I",
  },
  {
    bg: "from-indigo-500 via-indigo-400 to-indigo-300",
    glow: "shadow-indigo-400/40",
    letter: "N",
  },
  {
    bg: "from-violet-500 via-violet-400 to-violet-300",
    glow: "shadow-violet-400/40",
    letter: "G",
  },
  {
    bg: "from-purple-500 via-purple-400 to-purple-300",
    glow: "shadow-purple-400/40",
    letter: "O",
  },
];

function getBandToken(number: number | null): BandToken {
  if (!number || number < 1 || number > 75) {
    return {
      bg: "from-blue-600 via-blue-500 to-blue-400",
      glow: "shadow-blue-500/30",
      letter: "",
    };
  }

  const bandIndex = Math.min(
    Math.floor((number - 1) / 15),
    BINGO_BANDS.length - 1,
  );
  return BINGO_BANDS[bandIndex];
}

function formatDraw(number: number | null) {
  if (!number) return "--";
  return number.toString().padStart(2, "0");
}

export default function HomePage() {
  const [currentDraw, setCurrentDraw] = useState<number | null>(null);
  const [drawHistory, setDrawHistory] = useState<number[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  const recentDraws = useMemo(() => drawHistory.slice(0, 10), [drawHistory]);
  const inputRef = useRef<HTMLInputElement>(null);
  const drawHistoryRef = useRef(drawHistory);

  useEffect(() => {
    drawHistoryRef.current = drawHistory;
  }, [drawHistory]);

  useEffect(() => {
    inputRef.current?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    inputRef.current?.focus({ preventScroll: true });
  }, [currentDraw, drawHistory.length]);

  useEffect(() => {
    function handleUndo(event: KeyboardEvent) {
      if (event.key.toLowerCase() !== "z" || !(event.ctrlKey || event.metaKey))
        return;
      event.preventDefault();

      const [undone, ...rest] = drawHistoryRef.current;
      if (undone === undefined) return;

      setDrawHistory(rest);
      setCurrentDraw(rest[0] ?? null);
      toast(`Número ${formatDraw(undone)} desfeito.`);
    }

    window.addEventListener("keydown", handleUndo);
    return () => window.removeEventListener("keydown", handleUndo);
  }, []);

  function focusInput() {
    requestAnimationFrame(() => {
      inputRef.current?.focus({ preventScroll: true });
    });
  }

  const band = useMemo(() => getBandToken(currentDraw), [currentDraw]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsed = Number.parseInt(inputValue, 10);

    if (!Number.isFinite(parsed) || parsed < 1 || parsed > 75) {
      setError("Digite um número entre 1 e 75.");
      focusInput();
      return;
    }

    if (drawHistory.includes(parsed)) {
      setCurrentDraw(parsed);
      setError("Este número já foi sorteado.");
      setInputValue("");
      focusInput();
      return;
    }

    setError(null);
    setCurrentDraw(parsed);
    setDrawHistory((prev) => [
      parsed,
      ...prev.filter((value) => value !== parsed),
    ]);
    setInputValue("");
    focusInput();
  }

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-between overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 px-4 py-12 text-blue-50">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -inset-40 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.18),_transparent_60%)] blur-3xl" />
        <div className="absolute inset-y-0 -left-32 w-80 bg-[radial-gradient(circle,_rgba(110,231,183,0.15),_transparent_55%)] blur-2xl" />
        <div className="absolute -bottom-48 right-0 h-96 w-96 bg-[radial-gradient(circle,_rgba(129,140,248,0.22),_transparent_60%)] blur-3xl" />
      </div>

      <section className="flex w-full max-w-6xl flex-1 flex-col items-center justify-center gap-16">
        <div className="flex w-full flex-col items-center gap-12 md:flex-row md:items-end md:justify-center md:gap-16">
          <motion.div
            key={currentDraw ?? "placeholder"}
            className={cn(
              "relative flex size-[28rem] items-center justify-center rounded-full bg-gradient-to-br shadow-[0_20px_60px_-25px_rgba(59,130,246,0.6)] transition-colors ",
              band.glow,
              `bg-linear-to-br ${band.bg}`,
            )}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{
              scale: [0.92, 1.05, 0.98, 1],
              opacity: 1,
              rotate: [0, 3.5, -2.5, 0],
            }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              className="absolute inset-3 rounded-full bg-gradient-to-t from-white/25 via-white/10 to-transparent"
              animate={{
                opacity: [0.35, 0.6, 0.4],
                rotate: [0, 8, -6, 0],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
            <div className="relative flex flex-col items-center justify-center gap-2 text-white drop-shadow-md">
              <span className="text-8xl text-center font-medium  text-white/80 -mb-8">
                {band.letter || "BINGO"}
              </span>
              <span className="text-[8rem] text-center font-semibold tabular-nums ">
                {formatDraw(currentDraw)}
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="mt-16 w-full max-w-4xl">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-[0.4em] text-blue-200/70">
              Últimos 10 sorteios
            </h2>
            <span className="text-xs text-blue-200/50">
              Mais recente para mais antigo
            </span>
          </div>

          <Dialog
            onOpenChange={(open) => {
              if (!open) {
                focusInput();
              }
            }}
          >
            <DialogTrigger asChild>
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-full border border-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-blue-100 transition hover:border-white/40 hover:text-white focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-blue-200"
              >
                Mostrar todos
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-8xl  border border-white/10 bg-slate-950/90 text-blue-50 backdrop-blur-xl">
              <DialogHeader>
                <DialogTitle className="text-lg font-semibold uppercase tracking-[0.3em] text-white">
                  Todos os sorteios
                </DialogTitle>
                <DialogDescription className="text-sm text-blue-200/60">
                  Veja a lista completa dos números sorteados até agora.
                </DialogDescription>
              </DialogHeader>

              {drawHistory.length === 0 ? (
                <p className="text-sm text-blue-200/60">
                  Nenhum número sorteado ainda.
                </p>
              ) : (
                <div className="max-h-[80vh] overflow-y-auto pr-1">
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-7">
                    {drawHistory.map((draw) => {
                      const token = getBandToken(draw);
                      return (
                        <motion.li
                          key={draw}
                          layout="position"
                          initial={{ y: 12, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: -12, opacity: 0 }}
                          transition={{ duration: 0.35, ease: "easeOut" }}
                          className={cn(
                            "mt-3 flex items-center justify-between rounded-2xl bg-gradient-to-br px-4 py-3 text-white shadow-inner",
                            token.glow,
                            `bg-gradient-to-br ${token.bg}`,
                          )}
                        >
                          <span className="text-4xl font-medium uppercase tracking-[0.4em] text-white/80">
                            {token.letter}
                          </span>

                          <span className="text-6xl font-semibold tabular-nums">
                            {formatDraw(draw)}
                          </span>
                        </motion.li>
                      );
                    })}
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
          {recentDraws.length === 0 ? (
            <p className="py-6 text-center text-sm text-blue-200/60">
              Nenhum sorteio ainda. Adicione o primeiro número para começar o
              sorteio.
            </p>
          ) : (
            <motion.ul
              initial={false}
              animate={{ opacity: 1 }}
              className="grid gap-3 grid-cols-5"
              layout
            >
              <AnimatePresence initial={false} mode="popLayout">
                {recentDraws.slice(0, 10).map((draw) => {
                  const token = getBandToken(draw);
                  return (
                    <motion.li
                      key={draw}
                      layout="position"
                      initial={{ y: 12, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -12, opacity: 0 }}
                      transition={{ duration: 0.35, ease: "easeOut" }}
                      className={cn(
                        "mt-3 flex items-center justify-between rounded-2xl bg-gradient-to-br px-4 py-3 text-white shadow-inner",
                        token.glow,
                        `bg-gradient-to-br ${token.bg}`,
                      )}
                    >
                      <span className="text-4xl font-medium uppercase tracking-[0.4em] text-white/80">
                        {token.letter}
                      </span>

                      <span className="text-6xl font-semibold tabular-nums">
                        {formatDraw(draw)}
                      </span>
                    </motion.li>
                  );
                })}
              </AnimatePresence>
            </motion.ul>
          )}
        </div>
      </section>

      <motion.form
        onSubmit={handleSubmit}
        className="w-full gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl mt-4 sr-only"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45, duration: 0.6, ease: "easeOut" }}
      >
        <input
          id="draw-number"
          name="draw-number"
          type="number"
          min={1}
          max={75}
          value={inputValue}
          onChange={(event) =>
            setInputValue(event.target.value.replace(/[^\d]/g, ""))
          }
          onBlur={focusInput}
          placeholder="Digite um número entre 1 e 75"
          ref={inputRef}
          autoFocus
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? "draw-number-error" : undefined}
          className="h-12 w-full rounded-full border border-white/20 bg-white/10 px-5 text-base font-medium text-white placeholder:text-blue-200/50 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-300/60"
        />
        {error ? (
          <p id="draw-number-error" role="alert" className="sr-only">
            {error}
          </p>
        ) : null}
      </motion.form>
    </main>
  );
}
