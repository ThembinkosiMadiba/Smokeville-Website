import { ImageWithFallback } from "../figma/ImageWithFallback";

export function AboutPage() {
  const team = [
    {
      name: "Marcus Cole",
      role: "Head Chef",
      image:
        "https://images.unsplash.com/photo-1670819916552-67698b1c86ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVmJTIwY29va2luZyUyMGZpcmV8ZW58MXx8fHwxNzYwNzAwNDEwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      name: "Sarah Johnson",
      role: "Sommelier",
      image:
        "https://images.unsplash.com/photo-1620818309871-6255570324d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2NrdGFpbCUyMGJhciUyMGRhcmt8ZW58MXx8fHwxNzYwNzAwNDA5fDA&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      name: "David Chen",
      role: "Grill Master",
      image:
        "https://images.unsplash.com/photo-1594266063697-304befca9629?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmlsbGVkJTIwcmlicyUyMHNtb2tlfGVufDF8fHx8MTc2MDcwMDQwOXww&ixlib=rb-4.1.0&q=80&w=1080",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section
        className="relative h-[60vh] flex items-center justify-center"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1670819916552-67698b1c86ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVmJTIwY29va2luZyUyMGZpcmV8ZW58MXx8fHwxNzYwNzAwNDEwfDA&ixlib=rb-4.1.0&q=80&w=1080)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#121212]/80 via-[#121212]/60 to-[#121212]" />
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl mb-6 text-[#F5F5F5]">
            Our Story is Written in Flame
          </h1>
          <p className="text-xl text-[#F5F5F5]/80 max-w-2xl mx-auto">
            Where tradition meets innovation, and every dish is
            a masterpiece forged in fire
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Text */}
            <div>
              <h2 className="text-4xl mb-6 text-[#CBA135]">
                A Legacy of Flavor
              </h2>
              <div className="space-y-4 text-[#F5F5F5]/80">
                <p>
                  Founded in the heart of Soweto, <span className="smokeville-logo text-[#CBA135]">SMOKEVILLE</span> was born from a simple belief: great food
                  starts with fire. Our founder, inspired by
                  traditional smoking techniques from around the
                  world, set out to create a dining experience
                  that celebrates the primal art of cooking with
                  flame.
                </p>
                <p>
                  Every dish that leaves our kitchen carries
                  with it the essence of carefully selected
                  wood, the patience of slow cooking, and the
                  expertise of our master chefs. We source our
                  ingredients locally, supporting Cape Town's
                  finest farmers and producers.
                </p>
                <p>
                  From our signature wood-fired pizzas to our
                  legendary smoked ribs, each recipe has been
                  perfected over years of dedication. We don't
                  just serve food—we serve stories, memories,
                  and experiences that linger long after the
                  last bite.
                </p>
              </div>
            </div>

            {/* Image */}
            <div className="relative">
              <div className="aspect-[4/5] rounded-2xl overflow-hidden">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1670819916552-67698b1c86ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVmJTIwY29va2luZyUyMGZpcmV8ZW58MXx8fHwxNzYwNzAwNDEwfDA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Chef at work"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-[#1a1a1a] p-8 rounded-2xl border border-[#CBA135]/30 max-w-xs">
                <p className="text-[#F5F5F5]/80 italic mb-4">
                  "Fire is not just heat—it's transformation.
                  It's alchemy. It's where ordinary ingredients
                  become extraordinary."
                </p>
                <div className="border-t border-[#CBA135]/30 pt-4">
                  <p className="text-[#CBA135] font-['Playfair_Display'] text-2xl">
                    Marcus Cole
                  </p>
                  <p className="text-[#F5F5F5]/60 text-sm">
                    Founder & Head Chef
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-4 bg-[#0a0a0a]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl mb-12 text-center text-[#CBA135]">
            Our Philosophy
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-[#CBA135] to-[#B36A2E] rounded-full mx-auto mb-4 flex items-center justify-center text-[#121212] text-2xl">
                🔥
              </div>
              <h3 className="text-xl mb-3 text-[#F5F5F5]">
                Passion
              </h3>
              <p className="text-[#F5F5F5]/60">
                Every dish is crafted with unwavering dedication
                and love for the art of cooking
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-[#CBA135] to-[#B36A2E] rounded-full mx-auto mb-4 flex items-center justify-center text-[#121212] text-2xl">
                🌱
              </div>
              <h3 className="text-xl mb-3 text-[#F5F5F5]">
                Sustainability
              </h3>
              <p className="text-[#F5F5F5]/60">
                Supporting local farms and using sustainable
                practices in everything we do
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-[#CBA135] to-[#B36A2E] rounded-full mx-auto mb-4 flex items-center justify-center text-[#121212] text-2xl">
                ⭐
              </div>
              <h3 className="text-xl mb-3 text-[#F5F5F5]">
                Excellence
              </h3>
              <p className="text-[#F5F5F5]/60">
                Never compromising on quality, from ingredients
                to service
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl mb-12 text-center text-[#CBA135]">
            Meet the Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="group">
                <div className="aspect-[3/4] rounded-2xl overflow-hidden mb-4 relative">
                  <ImageWithFallback
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <h3 className="text-xl text-[#F5F5F5] mb-1">
                  {member.name}
                </h3>
                <p className="text-[#CBA135]">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}