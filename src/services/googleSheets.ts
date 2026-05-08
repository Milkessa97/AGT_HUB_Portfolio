/// <reference types="vite/client" />
import { Project, Winner, TimelineEvent, Member, AuthorizedUser } from '../types';

const SHEET_ID = import.meta.env.VITE_GOOGLE_SHEET_ID;

async function fetchSheetData(sheetName: string): Promise<any[]> {
  try {
    if (!SHEET_ID) {
      console.warn('VITE_GOOGLE_SHEET_ID is not set. Data will be empty.');
      return [];
    }

    const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(sheetName)}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const text = await response.text();
    
    if (text.includes('<!DOCTYPE html>') || text.includes('goog-signin-button')) {
      console.error(`[GoogleSheets] Access Denied for sheet "${sheetName}". Is the Google Sheet shared as "Anyone with the link can view"?`);
      return [];
    }

    const firstBracket = text.indexOf('(');
    const lastBracket = text.lastIndexOf(')');
    if (firstBracket === -1 || lastBracket === -1) {
      console.error(`[GoogleSheets] Unexpected response format for sheet "${sheetName}".`);
      return [];
    }

    const jsonStr = text.substring(firstBracket + 1, lastBracket);
    const data = JSON.parse(jsonStr);
    
    const rows = data.table.rows;
    let dataRows = rows;
    let cols = data.table.cols.map((col: any) => col.label || '');

    // Improved FALLBACK: Find the FIRST non-empty row to use as headers
    const hasNoLabels = cols.every(label => !label);
    if (hasNoLabels && rows.length > 0) {
      let headerRowIndex = -1;
      for (let i = 0; i < rows.length; i++) {
        if (rows[i].c && rows[i].c.some((cell: any) => cell && cell.v !== null && String(cell.v).trim() !== '')) {
          headerRowIndex = i;
          break;
        }
      }

      if (headerRowIndex !== -1) {
        console.log(`[GoogleSheets] Using row ${headerRowIndex} as headers for ${sheetName}.`);
        const headerRow = rows[headerRowIndex].c;
        cols = headerRow.map((cell: any) => cell ? String(cell.v || '').trim() : '');
        dataRows = rows.slice(headerRowIndex + 1);
      }
    }

    console.log(`[GoogleSheets] Resolved columns for ${sheetName}:`, cols);

    const result = dataRows.map((row: any) => {
      const obj: any = {};
      if (!row || !row.c) return obj;
      
      row.c.forEach((cell: any, i: number) => {
        if (cols[i]) {
          const key = cols[i].toLowerCase().trim().replace(/\s+/g, '_');
          obj[key] = cell ? (cell.v !== undefined ? cell.v : null) : null;
        }
      });
      return obj;
    }).filter(obj => Object.keys(obj).length > 0 && Object.values(obj).some(v => v !== null && v !== ''));

    console.log(`[GoogleSheets] Successfully processed ${result.length} non-empty items from ${sheetName}`);
    return result;
  } catch (error) {
    console.error(`Error fetching sheet ${sheetName}:`, error);
    return [];
  }
}

export const googleSheetsService = {
  async getProjects(): Promise<Project[]> {
    const rawData = await fetchSheetData('Projects');
    return rawData.map(item => {
      // Find keys using a more flexible lookup if needed, but defaults should work
      const title = item.title || item.Title || '';
      const category = item.category || item.Category || '';
      const description = item.description || item.Description || '';
      const team = item.team || item.Team || '';
      const tagsStr = item.tags || item.Tags || '';
      const status = item.status || item.Status || '';
      const github = item.github_url || item.github_link || item['github_url'] || '';
      const live = item.live_url || item.live_link || item['live_url'] || '';

      return {
        title: String(title),
        category: String(category),
        description: String(description),
        team: String(team),
        tags: typeof tagsStr === 'string' ? tagsStr.split(',').map((t: string) => t.trim()).filter(Boolean) : [],
        status: String(status),
        github_url: github ? String(github) : undefined,
        live_url: live ? String(live) : undefined,
      };
    });
  },

  async getWinners(): Promise<Winner[]> {
    const rawData = await fetchSheetData('Winners');
    
    // Utility to transform Google Drive "view" links to direct download links
    const transformDriveLink = (url: string) => {
      if (!url) return '';
      // Support for drive.google.com/file/d/ID/...
      const fileMatch = url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
      if (fileMatch && fileMatch[1]) {
        return `https://lh3.googleusercontent.com/d/${fileMatch[1]}`;
      }
      // Support for drive.google.com/open?id=ID
      const idMatch = url.match(/id=([a-zA-Z0-9_-]+)/);
      if (idMatch && idMatch[1]) {
        return `https://lh3.googleusercontent.com/d/${idMatch[1]}`;
      }
      return url;
    };

    return rawData.map(item => {
      const name = item.name || item.Name || '';
      const award = item.award || item.Award || '';
      const quote = item.quote || item.Quote || '';
      const rank = item.rank || item.Rank || '';
      const year = item.year || item.Year || '';
      const image = item.image || item.Image || item.image_link || item.Image_Link || item.image_url || item.Image_URL || item.link || item.Link || '';
      
      return {
        name: String(name),
        award: String(award),
        quote: String(quote),
        rank: String(rank),
        category: String(item.category || item.Category || ''),
        github_url: String(item.github_url || item.github || ''),
        portfolio_url: String(item.portfolio_url || item.portfolio || ''),
        image: transformDriveLink(String(image)),
        year: String(year)
      };
    });
  },

  async getTimelineEvents(): Promise<TimelineEvent[]> {
    const rawData = await fetchSheetData('Timeline');
    return rawData.map(item => {
      const date = item.date || item.Date || '';
      const title = item.title || item.Title || '';
      const type = item.type || item.Type || '';
      const description = item.description || item.Description || '';

      return {
        date: String(date),
        title: String(title),
        type: String(type),
        description: String(description),
      };
    });
  },

  async getMembers(): Promise<Member[]> {
    const rawData = await fetchSheetData('Members');
    return rawData.map(item => ({
      id: String(item.id || ''),
      name: String(item.name || ''),
      role: String(item.role || ''),
      contributions: typeof item.contributions === 'string' ? item.contributions.split(',').map((c: string) => c.trim()).filter(Boolean) : [],
      skills: typeof item.skills === 'string' ? item.skills.split(',').map((s: string) => s.trim()).filter(Boolean) : [],
      contact: String(item.contact || ''),
      image: String(item.image || ''),
      github_url: item.github_url ? String(item.github_url) : undefined,
      portfolio_url: item.portfolio_url ? String(item.portfolio_url) : undefined,
    }));
  },

  async getAuthorizedUsers(): Promise<AuthorizedUser[]> {
    const rawData = await fetchSheetData('AuthorizedUsers');
    return rawData.map(item => ({
      email: String(item.email || '').toLowerCase().trim(),
    }));
  }
};
