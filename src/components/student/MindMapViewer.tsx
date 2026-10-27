import React, { useState, useRef, useEffect } from 'react';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize2,
  Minimize2,
  ChevronRight,
  ChevronDown,
  Brain,
  Info,
  Sparkles,
  Stethoscope,
  Activity,
  Layers,
  Bookmark
} from 'lucide-react';
import { MindMap, MindMapNode, Chapter } from '../../types';
import { useData } from '../../context/DataContext';

interface MindMapViewerProps {
  chapter: Chapter;
  mindMap?: MindMap;
}

export const MindMapViewer: React.FC<MindMapViewerProps> = ({ chapter, mindMap }) => {
  const { recordMindMapView, toggleBookmark, isBookmarked } = useData();

  // Canvas Viewport State
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 80, y: 150 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedNode, setSelectedNode] = useState<MindMapNode | null>(null);
  const [collapsedNodes, setCollapsedNodes] = useState<Set<string>>(new Set());

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    recordMindMapView(chapter.id, chapter.bookId);
  }, [chapter.id, chapter.bookId, recordMindMapView]);

  if (!mindMap || mindMap.nodes.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 text-center space-y-4">
        <Brain className="w-12 h-12 text-slate-400 mx-auto" />
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
          No Mind Map Created Yet
        </h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          The administrator has not configured a visual concept mind map for this chapter yet.
        </p>
      </div>
    );
  }

  // Node type color styles
  const NODE_COLORS: Record<string, { bg: string; border: string; text: string; icon: string }> = {
    root: {
      bg: 'fill-sky-700',
      border: 'stroke-sky-400',
      text: 'fill-white',
      icon: 'text-sky-200'
    },
    etiology: {
      bg: 'fill-amber-600',
      border: 'stroke-amber-300',
      text: 'fill-white',
      icon: 'text-amber-200'
    },
    pathophysiology: {
      bg: 'fill-purple-700',
      border: 'stroke-purple-300',
      text: 'fill-white',
      icon: 'text-purple-200'
    },
    clinical: {
      bg: 'fill-rose-700',
      border: 'stroke-rose-300',
      text: 'fill-white',
      icon: 'text-rose-200'
    },
    investigations: {
      bg: 'fill-teal-700',
      border: 'stroke-teal-300',
      text: 'fill-white',
      icon: 'text-teal-200'
    },
    management: {
      bg: 'fill-emerald-700',
      border: 'stroke-emerald-300',
      text: 'fill-white',
      icon: 'text-emerald-200'
    },
    pearl: {
      bg: 'fill-yellow-600',
      border: 'stroke-yellow-300',
      text: 'fill-white',
      icon: 'text-yellow-100'
    }
  };

  // Toggle Collapse Node
  const toggleCollapse = (nodeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCollapsedNodes(prev => {
      const next = new Set(prev);
      if (next.has(nodeId)) next.delete(nodeId);
      else next.add(nodeId);
      return next;
    });
  };

  // Pan Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Zoom controls
  const handleZoomIn = () => setZoom(prev => Math.min(2.0, prev + 0.15));
  const handleZoomOut = () => setZoom(prev => Math.max(0.4, prev - 0.15));
  const handleReset = () => {
    setZoom(1);
    setPan({ x: 80, y: 150 });
  };

  // Layout Computation (Hierarchical Tree layout)
  // Build adjacency list
  const nodeMap = new Map<string, MindMapNode>();
  mindMap.nodes.forEach(n => nodeMap.set(n.id, n));

  const childrenMap = new Map<string, string[]>();
  mindMap.nodes.forEach(n => {
    if (n.parentId) {
      if (!childrenMap.has(n.parentId)) childrenMap.set(n.parentId, []);
      childrenMap.get(n.parentId)!.push(n.id);
    }
  });

  // Calculate coordinates dynamically
  interface ComputedNode {
    id: string;
    node: MindMapNode;
    x: number;
    y: number;
    width: number;
    height: number;
    hasChildren: boolean;
    isCollapsed: boolean;
  }

  const computedNodes: ComputedNode[] = [];
  const rootNode = mindMap.nodes.find(n => n.id === mindMap.rootNodeId) || mindMap.nodes[0];

  let currentY = 50;
  const LEVEL_SPACING_X = 260;
  const NODE_HEIGHT = 46;
  const VERTICAL_GAP = 28;

  function traverse(nodeId: string, level: number): { top: number; bottom: number } {
    const node = nodeMap.get(nodeId);
    if (!node) return { top: currentY, bottom: currentY };

    const children = childrenMap.get(nodeId) || [];
    const isCollapsed = collapsedNodes.has(nodeId);

    const hasChildren = children.length > 0;
    const x = level * LEVEL_SPACING_X;

    if (!hasChildren || isCollapsed) {
      const y = currentY;
      currentY += NODE_HEIGHT + VERTICAL_GAP;
      computedNodes.push({
        id: nodeId,
        node,
        x,
        y,
        width: 210,
        height: NODE_HEIGHT,
        hasChildren,
        isCollapsed
      });
      return { top: y, bottom: y };
    }

    // Children exist and expanded
    const childYs: number[] = [];
    children.forEach(cId => {
      const res = traverse(cId, level + 1);
      childYs.push((res.top + res.bottom) / 2);
    });

    const midY = (childYs[0] + childYs[childYs.length - 1]) / 2;

    computedNodes.push({
      id: nodeId,
      node,
      x,
      y: midY,
      width: 210,
      height: NODE_HEIGHT,
      hasChildren,
      isCollapsed
    });

    return { top: childYs[0], bottom: childYs[childYs.length - 1] };
  }

  traverse(rootNode.id, 0);

  // Compute visible edges
  const computedMap = new Map<string, ComputedNode>();
  computedNodes.forEach(cn => computedMap.set(cn.id, cn));

  const visibleEdges: { id: string; d: string }[] = [];
  mindMap.edges.forEach(e => {
    const src = computedMap.get(e.source);
    const tgt = computedMap.get(e.target);

    if (src && tgt) {
      const startX = src.x + src.width;
      const startY = src.y + src.height / 2;
      const endX = tgt.x;
      const endY = tgt.y + tgt.height / 2;
      const midX = (startX + endX) / 2;

      const pathData = `M ${startX} ${startY} C ${midX} ${startY}, ${midX} ${endY}, ${endX} ${endY}`;
      visibleEdges.push({ id: e.id, d: pathData });
    }
  });

  const isBookmarkedMap = isBookmarked(mindMap.id);

  return (
    <div
      ref={containerRef}
      className={`relative rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-900 text-white overflow-hidden shadow-xs select-none transition-all ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none h-screen w-screen' : 'h-[580px] w-full'
      }`}
    >
      {/* Top Overlay Controls Bar */}
      <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-slate-800 text-xs">
          <Brain className="w-4 h-4 text-sky-400" />
          <span className="font-bold truncate max-w-[200px] sm:max-w-xs">{mindMap.title}</span>
        </div>

        <div className="flex items-center gap-2 pointer-events-auto bg-slate-950/80 backdrop-blur-md p-1 rounded-2xl border border-slate-800">
          <button
            onClick={handleZoomIn}
            className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
            title="Zoom In (+)"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
            title="Zoom Out (-)"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={handleReset}
            className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
            title="Reset Zoom & Pan"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <div className="h-4 w-px bg-slate-800" />
          <button
            onClick={() =>
              toggleBookmark(
                'mindMap',
                mindMap.id,
                chapter.id,
                chapter.bookId,
                mindMap.title,
                `${chapter.title} • Mind Map`
              )
            }
            className={`p-1.5 rounded-xl transition-colors ${
              isBookmarkedMap ? 'text-amber-400' : 'text-slate-400 hover:text-white'
            }`}
            title="Bookmark Mind Map"
          >
            <Bookmark className={`w-4 h-4 ${isBookmarkedMap ? 'fill-current' : ''}`} />
          </button>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
            title="Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Interactive SVG Canvas */}
      <div
        className="w-full h-full cursor-grab active:cursor-grabbing overflow-hidden"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <svg
          className="w-full h-full"
          style={{
            backgroundImage: 'radial-gradient(circle, #334155 1px, transparent 1px)',
            backgroundSize: `${24 * zoom}px ${24 * zoom}px`
          }}
        >
          <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
            {/* Render connecting edges */}
            {visibleEdges.map(e => (
              <path
                key={e.id}
                d={e.d}
                fill="none"
                stroke="#475569"
                strokeWidth="2.5"
                strokeDasharray="none"
                className="transition-all"
              />
            ))}

            {/* Render Nodes */}
            {computedNodes.map(cn => {
              const node = cn.node;
              const style = NODE_COLORS[node.type] || NODE_COLORS.pearl;
              const isSelected = selectedNode?.id === node.id;

              return (
                <g
                  key={node.id}
                  transform={`translate(${cn.x}, ${cn.y})`}
                  onClick={e => {
                    e.stopPropagation();
                    setSelectedNode(node);
                  }}
                  className="cursor-pointer group"
                >
                  {/* Node Background Rectangle */}
                  <rect
                    width={cn.width}
                    height={cn.height}
                    rx="14"
                    className={`${style.bg} ${style.border} transition-all stroke-1 group-hover:stroke-2 ${
                      isSelected ? 'stroke-white stroke-2 drop-shadow-lg' : ''
                    }`}
                  />

                  {/* Node Text Label */}
                  <text
                    x={cn.hasChildren ? 14 : 14}
                    y={cn.height / 2 + 4}
                    fontSize="11"
                    fontWeight="700"
                    fontFamily="inherit"
                    className={`${style.text} select-none pointer-events-none`}
                  >
                    {node.text.length > 25 ? `${node.text.slice(0, 24)}…` : node.text}
                  </text>

                  {/* Expand/Collapse Toggle Button on branch nodes */}
                  {cn.hasChildren && (
                    <g
                      transform={`translate(${cn.width - 22}, ${cn.height / 2 - 8})`}
                      onClick={e => toggleCollapse(node.id, e)}
                      className="cursor-pointer"
                    >
                      <circle cx="8" cy="8" r="8" fill="rgba(0,0,0,0.3)" />
                      <text
                        x="5.5"
                        y="11.5"
                        fontSize="9"
                        fill="white"
                        fontWeight="bold"
                      >
                        {cn.isCollapsed ? '+' : '−'}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </g>
        </svg>
      </div>

      {/* Selected Node Details Drawer / Popup */}
      {selectedNode && (
        <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-80 bg-slate-900/95 backdrop-blur-md p-4 rounded-2xl border border-slate-700 shadow-2xl text-xs space-y-2 z-30 animate-fadeIn">
          <div className="flex items-center justify-between">
            <span className="font-bold uppercase tracking-wider text-[10px] text-sky-400 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Concept Node Detail
            </span>
            <button
              onClick={() => setSelectedNode(null)}
              className="text-slate-400 hover:text-white font-bold"
            >
              ✕
            </button>
          </div>

          <h4 className="font-extrabold text-white text-sm">
            {selectedNode.text}
          </h4>

          <div className="text-slate-300 leading-relaxed">
            {selectedNode.notes ? (
              <p>{selectedNode.notes}</p>
            ) : (
              <p className="text-slate-500 italic">
                Category node: {selectedNode.type.toUpperCase()}. Click sub-nodes or study text for expanded clinical notes.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Bottom Hint */}
      <div className="absolute bottom-3 left-4 text-[10px] text-slate-500 pointer-events-none hidden sm:block">
        💡 Drag to Pan • Scroll or use buttons to Zoom • Click node to view clinical notes
      </div>
    </div>
  );
};
