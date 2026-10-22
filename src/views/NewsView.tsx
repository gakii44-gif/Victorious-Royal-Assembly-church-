import React, { useState } from 'react';
import { NavView } from '../components/Navbar';
import { PlaceholderImage } from '../components/PlaceholderImage';
import { organizationData, NewsStory } from '../data/organizationData';
import { Calendar, User, ArrowRight, X, BookOpen, Camera } from 'lucide-react';
import { usePhotos } from '../context/PhotoContext';

interface NewsViewProps {
  onNavigate: (view: NavView) => void;
  onOpenAssetGuide: () => void;
  selectedStoryId?: string | null;
}

export const NewsView: React.FC<NewsViewProps> = ({
  onNavigate,
  onOpenAssetGuide,
  selectedStoryId,
}) => {
  const { newsStories } = organizationData;
  const { openUploadModal, isEditorMode } = usePhotos();
  const [activeStory, setActiveStory] = useState<NewsStory | null>(() => {
    if (selectedStoryId) {
      return newsStories.find(s => s.id === selectedStoryId) || null;
    }
    return null;
  });

  return (
    <div className="space-y-16 pb-20">
      {/* Banner */}
      <section className="bg-stone-900 text-white py-16 px-4 sm:px-8 border-b border-stone-800">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-widest text-lime-400 font-semibold">
            <span>Official Dispatches &amp; Field Updates</span>
            <span aria-hidden="true" className="text-stone-600">·</span>
            <span>Juba, South Sudan</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-heading">
            News &amp; Stories
          </h1>

          <p className="text-base sm:text-lg text-stone-300 max-w-3xl leading-relaxed">
            Verified updates from Victorious Royal Assembly International, Victorious Heritage Primary School, and our missionary community programs in Juba.
          </p>
        </div>
      </section>

      {/* Stories Listing */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {newsStories.map((story) => (
            <article 
              key={story.id} 
              className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs hover:border-emerald-300 transition-all flex flex-col justify-between"
            >
              <div className="p-5 pb-2">
                <PlaceholderImage
                  slotKey={story.photoSlotKey}
                  src={story.photoPlaceholderPath}
                  alt={story.title}
                  label={story.title}
                  recommendedPath={`/public${story.photoPlaceholderPath}`}
                  aspectRatio="16:9"
                  category="general"
                  onOpenAssetGuide={onOpenAssetGuide}
                />
              </div>

              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-stone-500">
                    <span className="font-semibold text-emerald-800">{story.category}</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {story.date}
                    </span>
                  </div>

                  <h2 className="font-bold text-slate-900 text-base leading-snug">
                    {story.title}
                  </h2>

                  <p className="text-xs text-stone-600 leading-relaxed line-clamp-3">
                    {story.summary}
                  </p>
                </div>

                <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                  <button
                    onClick={() => setActiveStory(story)}
                    className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 underline underline-offset-2"
                  >
                    <span>Read Full Story</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                  {isEditorMode && (
                    <button
                      onClick={() => openUploadModal(story.photoSlotKey, `${story.title} Photograph`)}
                      className="text-[11px] text-stone-400 hover:text-stone-700 flex items-center gap-1"
                      title="Upload real photograph"
                    >
                      <Camera className="w-3 h-3" />
                      <span>Upload</span>
                    </button>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Individual Article Reader Modal */}
      {activeStory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-stone-200">
            {/* Header */}
            <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
              <div className="space-y-0.5">
                <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider">
                  {activeStory.category} · {activeStory.date}
                </span>
                <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-tight">
                  {activeStory.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveStory(null)}
                className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-200 rounded-md transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Article Content */}
            <div className="p-6 overflow-y-auto space-y-6 text-sm text-stone-700">
              <PlaceholderImage
                slotKey={activeStory.photoSlotKey}
                src={activeStory.photoPlaceholderPath}
                alt={activeStory.title}
                label={activeStory.title}
                recommendedPath={`/public${activeStory.photoPlaceholderPath}`}
                aspectRatio="16:9"
                category="general"
                onOpenAssetGuide={onOpenAssetGuide}
              />

              <div className="space-y-4 text-xs sm:text-sm text-stone-700 leading-relaxed">
                {activeStory.content.map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>

              <div className="pt-4 border-t border-stone-200 text-xs text-stone-500 flex items-center justify-between">
                <span>Published by: <strong>{activeStory.author}</strong></span>
                <span className="italic">Juba, South Sudan</span>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-3 border-t border-stone-200 bg-stone-50 flex items-center justify-end">
              <button
                onClick={() => setActiveStory(null)}
                className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors"
              >
                Close Story
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsView;
