// app/page.js
import { cookies } from 'next/headers';
import { getPortfolioData } from '@/lib/portfolioRepository';
import { readPortfolioPersistence } from '@/lib/portfolioCookies';

export const dynamic = 'force-dynamic';

const TEMPLATES = [
  'premium',
  'terminal',
  'asthetic',
  'stickynote',
  'sinematic',
  'arcade',
  'kinetic',
  'kineticstage',
];

export default async function Home() {
  const data = await getPortfolioData();
  const { personal, socials, skills, Sections, data: rawData } = data;
  // Normalize: premium/sinematic get paginated shape, others get plain arrays
  const portfolioData = Object.fromEntries(
    Object.entries(rawData).map(([key, value]) => [
      key,
      value && typeof value === 'object' && Array.isArray(value.items)
        ? value
        : { items: value || [], total: (value || []).length, hasMore: false },
    ]),
  );
  const template = TEMPLATES.includes(data.template) ? data.template : 'premium';
  const cookieStore = await cookies();
  const persistence = readPortfolioPersistence(cookieStore, template);
  const initialColorTheme = persistence.colorTheme;
  const initialSectionId = persistence.sectionId;

  const templateModules =
    template === 'terminal'
      ? await Promise.all([
          import('@/templates/terminal/components/Hero'),
          import('@/templates/terminal/components/Layout'),
          import('@/templates/terminal/components/SectionTabs'),
        ])
      : template === 'asthetic'
        ? await Promise.all([
            import('@/templates/asthetic/components/Hero'),
            import('@/templates/asthetic/components/Layout'),
            import('@/templates/asthetic/components/SectionTabs'),
          ])
        : template === 'stickynote'
          ? await Promise.all([
              import('@/templates/stickynote/components/Hero'),
              import('@/templates/stickynote/components/Layout'),
              import('@/templates/stickynote/components/SectionTabs'),
            ])
          : template === 'sinematic'
            ? await Promise.all([
                import('@/templates/sinematic/components/Hero'),
                import('@/templates/sinematic/components/Layout'),
                import('@/templates/sinematic/components/SectionTabs'),
              ])
            : template === 'arcade'
              ? await Promise.all([
                  import('@/templates/arcade/components/Hero'),
                  import('@/templates/arcade/components/Layout'),
                  import('@/templates/arcade/components/SectionTabs'),
                ])
              : template === 'kinetic'
                ? await Promise.all([
                    import('@/templates/kinetic/components/Hero'),
                    import('@/templates/kinetic/components/Layout'),
                    import('@/templates/kinetic/components/SectionTabs'),
                  ])
                : template === 'kineticstage'
                  ? await Promise.all([
                      import('@/templates/kineticstage/components/Hero'),
                      import('@/templates/kineticstage/components/Layout'),
                      import('@/templates/kineticstage/components/SectionTabs'),
                    ])
                  : await Promise.all([
                      import('@/templates/premium/components/Hero'),
                      import('@/templates/premium/components/Layout'),
                      import('@/templates/premium/components/SectionTabs'),
                    ]);
  const [ThemeHero, ThemeLayout, ThemeSections] = templateModules.map(
    (module) => module.default,
  );
  const stats = personal.stats || (personal.traits || []).map((trait) => ({ value: trait }));

  return (
    <ThemeLayout
      personal={personal}
      socials={socials}
      skills={skills}
      Sections={Sections}
      initialColorTheme={initialColorTheme}
      initialSectionId={initialSectionId}
    >
      <section id="home">
        <ThemeHero
          name={personal.name}
          designation={personal.designation}
          headlines={personal.headlines}
          summary={personal.summary}
          email={personal.email}
          resume={personal.resume}
          location={personal.location}
          logo={personal.Logo}
          avatar={personal.Avatar}
          stats={stats}
          Sections={Sections}
        />
      </section>

      <section>
        <ThemeSections
          personal={personal}
          socials={socials}
          skills={skills}
          Sections={Sections}
          data={portfolioData}
          initialSectionId={initialSectionId}
          initialColorTheme={initialColorTheme}
        />
      </section>
    </ThemeLayout>
  );
}
