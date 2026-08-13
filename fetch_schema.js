import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';

const SUPABASE_URL = 'https://nzdqkfxjotdicmkfvfom.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im56ZHFrZnhqb3RkaWNta2Z2Zm9tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYyNDQzMjYsImV4cCI6MjEwMTgyMDMyNn0.kZ61mSMtyDJQ3MiexTkwFyKYbdIEUi_Eza5xgpJdS-g';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function inspectSchema() {
    console.log('Fetching schema from PostgREST...');
    // We can fetch OpenAPI spec from Supabase to get the schema of exposed tables.
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/?apikey=${SUPABASE_ANON_KEY}`);
        const openapi = await response.json();
        
        let schemaDoc = '# Database Schema\n\n';
        
        for (const [table, methods] of Object.entries(openapi.paths)) {
            if (table === '/') continue;
            const tableName = table.replace('/', '');
            schemaDoc += `## Table: ${tableName}\n\n`;
            
            // Get columns from the GET method response schema
            if (methods.get && methods.get.responses['200'] && methods.get.responses['200'].schema) {
                const schemaRef = methods.get.responses['200'].schema.items.$ref;
                if (schemaRef) {
                    const definitionName = schemaRef.split('/').pop();
                    const definition = openapi.definitions[definitionName];
                    if (definition && definition.properties) {
                        for (const [colName, colDef] of Object.entries(definition.properties)) {
                            schemaDoc += `- ${colName}: ${colDef.type} ${colDef.format ? '(' + colDef.format + ')' : ''} ${colDef.description ? '- ' + colDef.description : ''}\n`;
                        }
                    }
                }
            }
            schemaDoc += '\n';
        }
        
        fs.writeFileSync('schema_dump.md', schemaDoc);
        console.log('Saved schema to schema_dump.md');
    } catch (e) {
        console.error('Error fetching OpenAPI schema:', e);
    }
}

inspectSchema();
