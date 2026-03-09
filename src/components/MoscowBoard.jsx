import React, { useState, useEffect } from 'react';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const CATEGORIES = [
    { id: 'must', title: 'Must Have', color: 'var(--must-have)' },
    { id: 'should', title: 'Should Have', color: 'var(--should-have)' },
    { id: 'could', title: 'Could Have', color: 'var(--could-have)' },
    { id: 'wont', title: 'Won\'t Have', color: 'var(--wont-have)' }
];

export default function MoscowBoard() {
    const [items, setItems] = useLocalStorage('pm-moscow-items', []);
    const [newItemTitle, setNewItemTitle] = useState('');
    const [draggedItem, setDraggedItem] = useState(null);

    useEffect(() => {
        const handleAddToFramework = (e) => {
            const { item, targetFramework } = e.detail;
            if (targetFramework === 'moscow') {
                setItems(prev => [
                    ...prev,
                    { id: crypto.randomUUID(), title: item.title, category: 'must' }
                ]);
            }
        };

        window.addEventListener('add-to-framework', handleAddToFramework);
        return () => window.removeEventListener('add-to-framework', handleAddToFramework);
    }, [setItems]);

    const addItem = (e) => {
        e.preventDefault();
        if (!newItemTitle.trim()) return;

        setItems([
            ...items,
            { id: crypto.randomUUID(), title: newItemTitle.trim(), category: 'must' }
        ]);
        setNewItemTitle('');
    };

    const deleteItem = (id) => {
        setItems(items.filter(item => item.id !== id));
    };

    const setItemCategory = (id, newCategory) => {
        setItems(items.map(item =>
            item.id === id ? { ...item, category: newCategory } : item
        ));
    };

    // Drag and Drop Handlers
    const handleDragStart = (e, item) => {
        setDraggedItem(item);
        e.dataTransfer.effectAllowed = 'move';
        e.currentTarget.style.opacity = '0.5';
    };

    const handleDragEnd = (e) => {
        e.currentTarget.style.opacity = '1';
        setDraggedItem(null);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e, categoryId) => {
        e.preventDefault();
        if (draggedItem && draggedItem.category !== categoryId) {
            setItemCategory(draggedItem.id, categoryId);
        }
    };

    return (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%' }}>
            <div className="glass-panel" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2 style={{ marginBottom: '8px' }}>MoSCoW Prioritization</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        Drag and drop initiatives into MUST, SHOULD, COULD, and WON'T categories.
                    </p>
                </div>

                <form onSubmit={addItem} style={{ display: 'flex', gap: '12px' }}>
                    <input
                        className="input-field"
                        type="text"
                        placeholder="New Initiative..."
                        value={newItemTitle}
                        onChange={(e) => setNewItemTitle(e.target.value)}
                        style={{ width: '300px' }}
                    />
                    <button type="submit" className="btn btn-primary">
                        <Plus size={18} /> Add
                    </button>
                </form>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '20px',
                alignItems: 'start',
                minHeight: '500px'
            }}>
                {CATEGORIES.map(category => (
                    <div
                        key={category.id}
                        className="glass-panel"
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            height: '100%',
                            minHeight: '400px',
                            borderTop: `4px solid ${category.color}`,
                            background: 'rgba(30, 33, 46, 0.4)'
                        }}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, category.id)}
                    >
                        <div style={{ padding: '16px', borderBottom: '1px solid var(--border-color)' }}>
                            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.1rem' }}>
                                <span style={{
                                    width: '12px', height: '12px', borderRadius: '50%', background: category.color
                                }}></span>
                                {category.title}
                            </h3>
                            <div style={{
                                marginTop: '8px',
                                fontSize: '0.8rem',
                                color: 'var(--text-secondary)',
                                background: 'rgba(0,0,0,0.2)',
                                padding: '4px 8px',
                                borderRadius: '12px',
                                display: 'inline-block'
                            }}>
                                {items.filter(i => i.category === category.id).length} Items
                            </div>
                        </div>

                        <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {items.filter(i => i.category === category.id).map(item => (
                                <div
                                    key={item.id}
                                    draggable="true"
                                    onDragStart={(e) => handleDragStart(e, item)}
                                    onDragEnd={handleDragEnd}
                                    style={{
                                        background: 'var(--bg-secondary)',
                                        border: '1px solid var(--border-color)',
                                        padding: '12px',
                                        borderRadius: 'var(--border-radius-sm)',
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        gap: '12px',
                                        cursor: 'grab',
                                        transition: 'all 0.2s ease',
                                        boxShadow: 'var(--shadow-sm)'
                                    }}
                                    onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                                    onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                                >
                                    <GripVertical size={16} style={{ color: 'var(--text-tertiary)', marginTop: '4px', cursor: 'grab' }} />
                                    <div style={{ flex: 1, wordBreak: 'break-word', fontSize: '0.95rem' }}>
                                        {item.title}
                                    </div>
                                    <button
                                        onClick={() => deleteItem(item.id)}
                                        style={{
                                            background: 'none', border: 'none', color: 'var(--text-tertiary)',
                                            cursor: 'pointer', padding: '4px'
                                        }}
                                        onMouseOver={(e) => e.currentTarget.style.color = 'var(--danger)'}
                                        onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-tertiary)'}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}

                            {items.filter(i => i.category === category.id).length === 0 && (
                                <div style={{
                                    textAlign: 'center',
                                    color: 'var(--text-tertiary)',
                                    padding: '32px 0',
                                    fontSize: '0.9rem',
                                    borderStyle: 'dashed',
                                    borderWidth: '1px',
                                    borderColor: 'var(--border-color)',
                                    borderRadius: 'var(--border-radius-sm)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    Drop items here
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
