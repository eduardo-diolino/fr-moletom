import React, { useState, useEffect } from 'react';
import { X, FolderPlus, Folder, Check, Plus, Heart } from 'lucide-react';
import { FavoriteGroup } from '../types';

interface FavoriteGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string | null;
  productName: string;
  productImage: string;
  groups: FavoriteGroup[];
  onCreateGroup: (name: string) => FavoriteGroup;
  onSaveToGroups: (productId: string, selectedGroupIds: string[]) => void;
}

export default function FavoriteGroupModal({
  isOpen,
  onClose,
  productId,
  productName,
  productImage,
  groups,
  onCreateGroup,
  onSaveToGroups
}: FavoriteGroupModalProps) {
  const [newGroupName, setNewGroupName] = useState('');
  const [selectedGroupIds, setSelectedGroupIds] = useState<string[]>([]);
  const [errorMsg, setErrorMsg] = useState('');

  // Reset or pre-populate selections when modal opens
  useEffect(() => {
    if (isOpen && productId) {
      // Pre-select groups that already contain this product
      const containingGroupIds = groups
        .filter(g => g.productIds.includes(productId))
        .map(g => g.id);
      
      setSelectedGroupIds(containingGroupIds);
      setNewGroupName('');
      setErrorMsg('');
    }
  }, [isOpen, productId, groups]);

  if (!isOpen || !productId) return null;

  const handleToggleGroup = (groupId: string) => {
    setSelectedGroupIds(prev =>
      prev.includes(groupId)
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  };

  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    const name = newGroupName.trim();
    if (!name) return;

    // Check if group name already exists
    const exists = groups.some(g => g.name.toLowerCase() === name.toLowerCase());
    if (exists) {
      setErrorMsg('Você já possui uma pasta com este nome!');
      return;
    }

    const newGroup = onCreateGroup(name);
    setSelectedGroupIds(prev => [...prev, newGroup.id]);
    setNewGroupName('');
    setErrorMsg('');
  };

  const handleConfirm = () => {
    onSaveToGroups(productId, selectedGroupIds);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white border border-gray-150 w-full max-w-md relative shadow-2xl animate-scaleUp">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-150 px-5 py-4 bg-[#002855] text-white">
          <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
            <Heart size={14} className="fill-red-500 text-red-500 animate-pulse" /> Organizar Favorito
          </h3>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-5">
          {/* Product Preview */}
          <div className="flex items-center gap-3.5 bg-gray-50 border border-gray-150 p-3 mb-5">
            <img
              src={productImage}
              alt={productName}
              referrerPolicy="no-referrer"
              className="w-12 h-16 object-cover border border-gray-200"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=200';
              }}
            />
            <div className="flex-1 min-w-0">
              <span className="text-[9px] font-black text-[#FF7A00] uppercase tracking-wider block">
                Salvar nos Favoritos
              </span>
              <h4 className="font-extrabold text-xs text-gray-800 line-clamp-2 mt-0.5 leading-tight">
                {productName}
              </h4>
            </div>
          </div>

          {/* Create Group Form */}
          <form onSubmit={handleCreateGroup} className="mb-5">
            <label className="block text-[10px] font-black uppercase text-gray-500 tracking-wider mb-1.5">
              Criar Nova Pasta de Favoritos
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newGroupName}
                onChange={(e) => {
                  setNewGroupName(e.target.value);
                  setErrorMsg('');
                }}
                placeholder="Ex: Looks de Frio, Presentes, Desejos..."
                className="flex-1 border border-gray-200 px-3 py-2 text-xs font-semibold focus:outline-none focus:border-[#002855]"
              />
              <button
                type="submit"
                className="bg-[#002855] hover:bg-[#FF7A00] text-white px-3.5 py-2 flex items-center justify-center transition-all cursor-pointer"
                title="Criar pasta"
              >
                <Plus size={16} />
              </button>
            </div>
            {errorMsg && (
              <p className="text-[10px] font-bold text-red-500 mt-1 uppercase tracking-wider">
                ⚠️ {errorMsg}
              </p>
            )}
          </form>

          {/* Groups Selection List */}
          <div className="mb-6">
            <label className="block text-[10px] font-black uppercase text-gray-500 tracking-wider mb-2">
              Selecionar Pastas ({groups.length})
            </label>
            
            {groups.length === 0 ? (
              <div className="border border-dashed border-gray-200 rounded-none p-5 text-center text-xs text-gray-400 font-semibold">
                <Folder size={24} className="mx-auto text-gray-300 mb-1.5" />
                Nenhuma pasta criada. Digite um nome acima para criar sua primeira pasta de favoritos!
              </div>
            ) : (
              <div className="border border-gray-150 max-h-48 overflow-y-auto divide-y divide-gray-100">
                {groups.map((group) => {
                  const isChecked = selectedGroupIds.includes(group.id);
                  return (
                    <div
                      key={group.id}
                      onClick={() => handleToggleGroup(group.id)}
                      className="flex items-center justify-between px-3 py-2.5 hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Folder size={14} className="text-[#FF7A00] shrink-0" />
                        <span className="text-xs font-bold text-gray-700 truncate">
                          {group.name}
                        </span>
                        <span className="bg-gray-100 text-[9px] px-1.5 py-0.5 rounded-full font-mono font-bold text-gray-500">
                          {group.productIds.length} {group.productIds.length === 1 ? 'item' : 'itens'}
                        </span>
                      </div>
                      <div className={`w-4 h-4 border flex items-center justify-center transition-colors ${
                        isChecked ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-gray-300 bg-white'
                      }`}>
                        {isChecked && <Check size={10} className="stroke-[3]" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="flex gap-2.5 border-t border-gray-100 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 text-xs font-black uppercase tracking-widest transition-all cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="flex-1 bg-[#002855] hover:bg-[#FF7A00] text-white py-3 text-xs font-black uppercase tracking-widest transition-all cursor-pointer shadow-md"
            >
              Salvar
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
