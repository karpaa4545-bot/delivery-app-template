import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'Nenhum arquivo enviado' }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;

        // 1. Tenta Upload no Supabase (Nuvem)
        if (supabase) {
            const filePath = `uploads/${fileName}`;
            const { error: uploadError } = await supabase.storage
                .from('images')
                .upload(filePath, buffer, {
                    contentType: file.type || 'image/jpeg',
                    upsert: true
                });

            if (uploadError) {
                console.error("Erro Supabase:", uploadError);
                return NextResponse.json({ error: `Erro Supabase: ${uploadError.message}` }, { status: 500 });
            }

            const { data: { publicUrl } } = supabase.storage
                .from('images')
                .getPublicUrl(filePath);

            return NextResponse.json({ url: publicUrl });
        }

        // 2. Fallback para Desenvolvimento Local (Apenas se não houver Supabase)
        if (process.env.NODE_ENV === 'development') {
            const uploadDir = path.join(process.cwd(), 'public', 'uploads');
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            const filePathLocal = path.join(uploadDir, fileName);
            fs.writeFileSync(filePathLocal, buffer);

            const fileUrl = `/uploads/${fileName}`;
            return NextResponse.json({ url: fileUrl });
        }

        return NextResponse.json({ error: 'Configuração de armazenamento (Supabase) ausente ou inválida.' }, { status: 500 });

    } catch (error: any) {
        console.error("Erro geral no upload:", error);
        return NextResponse.json({ error: `Erro interno: ${error.message}` }, { status: 500 });
    }
}
