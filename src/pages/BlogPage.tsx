import { useEffect, useState } from 'react';
import { Calendar, Tag, User } from 'lucide-react';
import { blogPosts as fallbackPosts, type BlogPost as FallbackPost } from '../data/blog';
import { supabase } from '../lib/supabase';
import type { BlogPost } from '../lib/database.types';

type PublicPost = BlogPost | FallbackPost;

const BlogPage = () => {
  const [posts, setPosts] = useState<PublicPost[]>(fallbackPosts);

  useEffect(() => {
    supabase.from('blog_posts').select('*').eq('published', true).order('published_at', { ascending: false }).then(({ data, error }) => {
      if (error) {
        console.error('blog load failed', error);
        return;
      }
      if (data && data.length > 0) setPosts(data as BlogPost[]);
    });
  }, []);

  return <div className="min-h-screen bg-gray-50 pt-24 pb-16"><div className="container"><h1 className="text-3xl md:text-4xl font-bold mb-4 text-center">Blog Incom</h1><p className="text-center text-gray-600 max-w-3xl mx-auto mb-12">Fique por dentro das novidades, dicas e informações sobre ortopedia e saúde.</p><div className="grid grid-cols-1 lg:grid-cols-3 gap-8"><div className="lg:col-span-2 space-y-8">{posts.map((post) => { const date = 'published_at' in post ? post.published_at : post.date; const author = 'author_name' in post ? post.author_name : post.author; const image = 'cover_image' in post ? post.cover_image : post.image; const tags = post.tags ?? []; return <article key={post.id} id={post.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden"><div className="h-56 sm:h-72 overflow-hidden bg-[#102b3d]">{image && <img src={image} alt={post.title} className="w-full h-full object-cover" />}</div><div className="p-7 sm:p-8"><div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4"><div className="flex items-center"><Calendar size={16} className="mr-1" />{date ? new Intl.DateTimeFormat('pt-BR').format(new Date(date.includes('/') ? date.split('/').reverse().join('-') : date)) : 'Conteúdo Incom'}</div><div className="flex items-center"><User size={16} className="mr-1" />{author}</div></div><h2 className="text-2xl font-semibold mb-4">{post.title}</h2><p className="text-gray-600 leading-7 whitespace-pre-line mb-6">{post.content.replace(/<[^>]+>/g, '')}</p><div className="flex flex-wrap gap-2 border-t pt-4">{tags.map((tag) => <span key={tag} className="flex items-center text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full"><Tag size={12} className="mr-1" />{tag}</span>)}</div></div></article>; })}</div><aside className="space-y-6"><div className="bg-white rounded-2xl border border-slate-200 p-6"><h3 className="text-lg font-semibold mb-4">Conteúdos da clínica</h3><p className="text-sm text-gray-600 leading-6">Artigos revisados pela equipe para apoiar decisões mais conscientes sobre movimento, dor e recuperação.</p></div><div className="bg-[#102b3d] text-white rounded-2xl p-6"><h3 className="text-lg font-semibold">Precisa de avaliação?</h3><p className="text-white/65 text-sm leading-6 mt-3">Converse com a equipe e encontre o melhor horário para o seu atendimento.</p><a href="/appointment" className="btn bg-[#087b63] hover:bg-[#096b57] text-white inline-flex mt-6">Agendar consulta</a></div></aside></div></div></div>;
};

export default BlogPage;
