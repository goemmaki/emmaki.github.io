// A main page's opening (About, Proof, Brands): the page's word set massive along the bottom of the window,
// with the owner's intro just above it on the right-hand columns. `ink` is the word's measured ink width in em (Geist 600
// at -0.06em tracking), so a long word can shrink to fit. Styles: "Page cover" in globals.css.
export function PageCover({ word, ink, intro }: { word: string; ink: number; intro: string }) {
  return (
    <section className="page-cover relative -mt-16 overflow-x-clip [container-type:inline-size]" style={{ "--ink": ink } as React.CSSProperties}>
      <div className="flex min-h-svh flex-col justify-end pt-16">
        <p className="page-cover-intro shell pb-8 type-lead text-fg-2">
          <span className="block max-w-[36ch]">{intro}</span>
        </p>
        <h1 className="page-cover-word text-fg-max">{word}</h1>
      </div>
      <div className="page-cover-overhang" aria-hidden />
    </section>
  );
}
