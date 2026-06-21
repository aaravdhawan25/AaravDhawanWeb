import { useForm, ValidationError } from '@formspree/react'
import { motion } from 'framer-motion'
import { Send, Mail, MessageSquare, ExternalLink } from 'lucide-react'
import TiltCard from './TiltCard'

const GithubIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
)

const LinkedinIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
)

const socials = [
  { icon: GithubIcon, label: 'GitHub', href: 'https://github.com/aaravdhawan25', handle: '@aaravdhawan25' },
  { icon: LinkedinIcon, label: 'LinkedIn', href: 'https://www.linkedin.com/in/aarav-dhawan-0564693a4', handle: 'aarav-dhawan' },
  { icon: Mail, label: 'Email', href: 'mailto:aaravdhawan25@gmail.com', handle: 'aaravdhawan25@gmail.com' },
]

const inputCls = `
  h-11 px-4 rounded-xl border border-zinc-200 dark:border-zinc-800
  bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 text-sm
  placeholder:text-zinc-400 dark:placeholder:text-zinc-600
  focus:outline-none focus:ring-2 focus:ring-[#0071e3]/40 focus:border-[#0071e3]
  transition-all duration-150 w-full
`

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
}

export default function Contact() {
  const [state, handleSubmit] = useForm('xaqgwyyw')

  return (
    <section id="contact" className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}
          className="mb-12"
        >
          <span className="text-[12px] uppercase tracking-[0.15em] font-semibold text-[#0071e3]">Contact</span>
          <h2 className="mt-3 text-[clamp(2rem,5vw,3rem)] font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Let's build something.
          </h2>
          <p className="mt-3 text-lg text-zinc-500 dark:text-zinc-400 max-w-lg">
            Open to collaboration, mentorship, internship opportunities, and cool conversations about robots.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Form */}
          <motion.div
            initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}
            className="lg:col-span-3"
          >
            {state.succeeded ? (
              <TiltCard className="flex flex-col items-center justify-center h-60 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 text-center px-8">
                <div className="w-12 h-12 rounded-full bg-[#30d158]/15 flex items-center justify-center mb-4">
                  <Send size={22} className="text-[#30d158]" />
                </div>
                <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50 mb-2">Message sent!</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">Thanks for reaching out — I'll reply soon.</p>
              </TiltCard>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="name" className="text-[12px] font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">Name</label>
                    <input id="name" name="name" type="text" required placeholder="Your name" className={inputCls} />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="email" className="text-[12px] font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">Email</label>
                    <input id="email" name="email" type="email" required placeholder="you@example.com" className={inputCls} />
                    <ValidationError field="email" prefix="Email" errors={state.errors}
                      className="text-xs text-red-500 mt-0.5" />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="message" className="text-[12px] font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">Message</label>
                  <textarea
                    id="message" name="message" required rows={5}
                    placeholder="What would you like to work on?"
                    className={`${inputCls} h-auto py-3 resize-none`}
                  />
                  <ValidationError field="message" prefix="Message" errors={state.errors}
                    className="text-xs text-red-500 mt-0.5" />
                </div>

                <ValidationError errors={state.errors} className="text-xs text-red-500" />

                <motion.button
                  type="submit"
                  disabled={state.submitting}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="self-start h-11 px-7 rounded-full bg-[#0071e3] text-white text-[14px] font-semibold hover:bg-[#0077ed] disabled:opacity-60 transition-colors duration-150 flex items-center gap-2"
                >
                  <Send size={14} />
                  {state.submitting ? 'Sending…' : 'Send message'}
                </motion.button>
              </form>
            )}
          </motion.div>

          {/* Right column */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {socials.map(({ icon: Icon, label, href, handle }, i) => (
              <motion.div
                key={label}
                initial="hidden" whileInView="show" viewport={{ once: true }}
                variants={{ hidden: { opacity: 0, x: 16 }, show: { opacity: 1, x: 0, transition: { duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] } } }}
              >
                <TiltCard intensity={8} className="rounded-2xl">
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors duration-150 group"
                  >
                    <div className="w-9 h-9 rounded-full bg-white dark:bg-zinc-800 flex items-center justify-center flex-shrink-0 border border-zinc-200 dark:border-zinc-700">
                      <Icon size={15} className="text-zinc-600 dark:text-zinc-300" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{label}</p>
                      <p className="text-[12px] text-zinc-400 dark:text-zinc-500 font-mono truncate">{handle}</p>
                    </div>
                    <ExternalLink size={13} className="text-zinc-300 dark:text-zinc-600 flex-shrink-0 group-hover:text-zinc-500 dark:group-hover:text-zinc-400 transition-colors" />
                  </a>
                </TiltCard>
              </motion.div>
            ))}

            {/* Voiceflow placeholder */}
            <motion.div
              initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}
            >
              <TiltCard intensity={6} className="rounded-2xl">
                <div className="rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-900/30 p-5 flex flex-col items-center justify-center gap-3 text-center min-h-[120px]">
                  <div className="w-10 h-10 rounded-full bg-[#0071e3]/10 border border-[#0071e3]/20 flex items-center justify-center">
                    <MessageSquare size={18} className="text-[#0071e3]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">AI Assistant</p>
                    <p className="text-[12px] text-zinc-400 dark:text-zinc-500 mt-0.5">Voiceflow widget embeds here.</p>
                  </div>
                  <div id="voiceflow-embed" className="w-full" />
                </div>
              </TiltCard>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
