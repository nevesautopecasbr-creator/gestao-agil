export default function SectionContainer({ id, className = '', children }) {
  return (
    <section id={id} className={`px-6 py-20 md:py-24 ${className}`}>
      <div className="mx-auto w-full max-w-6xl">
        {children}
      </div>
    </section>
  );
}
