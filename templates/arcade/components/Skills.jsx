'use client';

import { motion } from 'framer-motion';

export default function Skills({ skills = [] }) { return <section className="arcade-panel"><div className="arcade-panel-label">MISSION 03 / LOADOUT</div><p className="arcade-kicker">Unlocked abilities</p><h2>Tools in the <em>inventory.</em></h2><div className="arcade-skill-grid">{skills.map((skill, index) => <motion.article key={skill.name || index} whileHover={{ y: -4, scale: 1.02 }} whileInView={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 12 }} viewport={{ once: true }} transition={{ delay: index * .04 }}><span className="arcade-skill-index">0{index + 1}</span><strong>{skill.name}</strong><small>{skill.level || 'Equipped'}</small><div className="arcade-meter"><i style={{ width: `${Math.min(100, 50 + index * 8)}%` }} /></div></motion.article>)}</div></section>; }
