export default function TopBar({
  onToggleMode,
  onOpenModal,
}: {
  onToggleMode: () => void;
  onOpenModal: () => void;
}) {
  return (
    <header className="sticky top-0 z-40 bg-[#E5E5E5]/90 backdrop-blur border-b">
      <div className="max-w-4xl mx-auto px-4 py-2 flex items-center justify-between gap-2">
        <button
          onClick={onToggleMode}
          className="px-3 py-2 rounded border bg-white shadow-sm"
        >
          Режимди өзгөртүү
        </button>
        <button
          onClick={onOpenModal}
          className="px-3 py-2 rounded border bg-white shadow-sm"
        >
          Далилдер / Жɵндɵɵлɵр
        </button>
      </div>
    </header>
  );
}
