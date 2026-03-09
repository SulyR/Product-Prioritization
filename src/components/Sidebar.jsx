import React, { useState } from 'react';
import { Plus, ListTodo, Bug, Lightbulb, Trash2, ArrowRight } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const ITEM_TYPES = {
    INITIATIVE: { id: 'initiative', label: 'Initiative', icon: ListTodo, color: 'var(--info)' },
    BUG: { id: 'bug', label: 'Bug', icon: Bug, color: 'var(--danger)' },
    IDEA: { id: 'idea', label: 'Idea', icon: Lightbulb, color: 'var(--warning)' }
};

export default function Sidebar({ activeFramework }) {
    const [backlogItems, setBacklogItems] = useLocalStorage('pm-backlog-items', []);
    const [newItemTitle, setNewItemTitle] = useState('');
    const [newItemType, setNewItemType] = useState(ITEM_TYPES.INITIATIVE.id);

    const getFrameworkName = () => {
        switch (activeFramework) {
            case 'moscow': return 'MoSCoW';
            case 'rice': return 'RICE';
            case 'weighted': return 'Weighted List';
            default: return 'Framework';
        }
    };

    const addItem = (e) => {
        e.preventDefault();
        if (!newItemTitle.trim()) return;

        setBacklogItems([
            ...backlogItems,
            { id: crypto.randomUUID(), title: newItemTitle.trim(), type: newItemType }
        ]);
        setNewItemTitle('');
    };

    const deleteItem = (id) => {
        setBacklogItems(backlogItems.filter(item => item.id !== id));
    };

    const addToFramework = (item) => {
        // Dispatch custom event to notify framework components
        const event = new CustomEvent('add-to-framework', {
            detail: { item, targetFramework: activeFramework }
        });
        window.dispatchEvent(event);
    };

    return (
        <aside className="sidebar glass-panel">
            <div className="sidebar-header">
                <h2>Backlog</h2>
                <p>Manage unassigned items</p>
            </div>

            <form onSubmit={addItem} className="sidebar-form">
                <input
                    className="input-field"
                    type="text"
                    placeholder="New item..."
                    value={newItemTitle}
                    onChange={(e) => setNewItemTitle(e.target.value)}
                />
                <div style={{ display: 'flex', gap: '8px' }}>
                    <select
                        className="input-field"
                        value={newItemType}
                        onChange={(e) => setNewItemType(e.target.value)}
                        style={{ flex: 1 }}
                    >
                        {Object.values(ITEM_TYPES).map(type => (
                            <option key={type.id} value={type.id}>{type.label}</option>
                        ))}
                    </select>
                    <button type="submit" className="btn btn-primary" style={{ padding: '8px' }}>
                        <Plus size={18} />
                    </button>
                </div>
            </form>

            <div className="backlog-list">
                {backlogItems.map(item => {
                    const typeConfig = Object.values(ITEM_TYPES).find(t => t.id === item.type) || ITEM_TYPES.INITIATIVE;
                    const Icon = typeConfig.icon;

                    return (
                        <div key={item.id} className="backlog-item">
                            <div className="backlog-item-header">
                                <span className={`badge badge-${item.type}`} style={{ color: typeConfig.color, borderColor: typeConfig.color }}>
                                    <Icon size={12} style={{ marginRight: '4px', verticalAlign: 'text-bottom' }} />
                                    {typeConfig.label}
                                </span>
                                <button
                                    onClick={() => deleteItem(item.id)}
                                    className="btn-icon text-danger"
                                    title="Delete from backlog"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                            <div className="backlog-item-title">{item.title}</div>

                            {activeFramework && (
                                <button
                                    className="btn btn-secondary btn-full add-framework-btn"
                                    onClick={() => addToFramework(item)}
                                >
                                    Add to {getFrameworkName()} <ArrowRight size={14} />
                                </button>
                            )}
                        </div>
                    );
                })}

                {backlogItems.length === 0 && (
                    <div className="empty-state">
                        Backlog is empty. Add initiatives, bugs, or ideas above.
                    </div>
                )}
            </div>
        </aside>
    );
}
