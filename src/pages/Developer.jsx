import { motion } from 'framer-motion';
import { Mail, ExternalLink, Rocket, Heart, Code2 } from 'lucide-react';

const Developer = () => {
  const socialLinks = [
    { name: 'GitHub', icon: <i className="devicon-github-original text-xl"></i>, url: 'https://github.com/likhonsorkar', color: 'bg-slate-900' },
    { name: 'LinkedIn', icon: <i className="devicon-linkedin-plain text-xl"></i>, url: 'https://linkedin.com/in/likhonsorkar', color: 'bg-blue-600' },
    { name: 'Facebook', icon: <i className="devicon-facebook-plain text-xl"></i>, url: 'https://facebook.com/likhon.com.bd', color: 'bg-indigo-600' },
    { name: 'Portfolio', icon: <img src='/favicon.png' />, url: 'https://likhonsorkar.com', color: '' },
  ];

  const skills = [
    { name: 'React', icon: 'devicon-react-original colored' },
    { name: 'Tailwind CSS', icon: 'devicon-tailwindcss-original colored' },
    { name: 'Node.js', icon: 'devicon-nodejs-plain colored' },
    { name: 'JavaScript', icon: 'devicon-javascript-plain colored' },
    { name: 'Python', icon: 'devicon-python-plain colored' },
    { name: 'Git', icon: 'devicon-git-plain colored' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20">
      <header className="text-center space-y-4">
        <div className="inline-block p-2 bg-indigo-50 rounded-2xl mb-2">
          <Code2 className="w-6 h-6 text-indigo-600" />
        </div>
        <h2 className="text-4xl font-black text-slate-900 tracking-tight">Developer Profile</h2>
        <p className="text-slate-500 max-w-md mx-auto">The mind behind LifeTrack Planner. Passionate about building tools that improve daily lives.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:col-span-1 bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-xl shadow-slate-200/50 flex flex-col items-center text-center relative overflow-hidden"
        >
          <div className="relative mb-6">
            <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 p-1 shadow-lg">
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                <img 
                  src="/favicon.png" 
                  alt="MD. Likhon Sorkar" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="absolute -bottom-2 -right-2 bg-emerald-500 border-4 border-white w-8 h-8 rounded-full shadow-sm" title="Available for projects"></div>
          </div>

          <h3 className="text-2xl font-bold text-slate-900">MD. Likhon Sorkar</h3>
          <p className="text-indigo-600 font-bold text-sm uppercase tracking-widest mt-1">Full Stack Developer</p>
          
          <div className="flex gap-2 mt-6">
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`p-2.5 rounded-xl text-white ${link.color} hover:scale-110 transition-transform shadow-md flex items-center justify-center`}
                title={link.name}
              >
                {link.icon}
              </a>
            ))}
          </div>

          <button className="w-full mt-8 py-3 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors text-sm uppercase tracking-widest">
            <Mail className="w-4 h-4" /> Hire Me
          </button>
          
          <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-indigo-50 rounded-full blur-3xl opacity-50" />
        </motion.div>

        {/* Details & Experience */}
        <div className="md:col-span-2 space-y-6">
          <section className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm">
            <h4 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <i className="devicon-vscode-plain colored"></i> Tech Stack
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {skills.map((skill) => (
                <div key={skill.name} className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100 group hover:bg-white hover:shadow-md transition-all">
                  <i className={`${skill.icon} text-2xl group-hover:scale-110 transition-transform`}></i>
                  <span className="text-xs font-bold text-slate-600">{skill.name}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2.5rem] p-8 text-white shadow-xl">
            <h4 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Rocket className="w-5 h-5 text-indigo-400" /> About the Project
            </h4>
            <p className="text-slate-300 leading-relaxed text-sm">
              LifeTrack Planner was designed to be a lightweight yet powerful all-in-one productivity suite. 
              By integrating Task Management, Notes, and Spiritual tools like the Tasbih and Prayer Times, 
              it aims to provide a holistic approach to daily life management.
            </p>
            <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
               <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Made with <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> in Bangladesh
               </div>
               <a href="https://github.com/likhon-sorkar/lifetrack-planner" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs font-black text-indigo-400 hover:text-indigo-300 transition-colors uppercase tracking-widest">
                  View Source <ExternalLink className="w-3 h-3" />
               </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Developer;
