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
            try {
                const filePath = `uploads/${fileName}`;
                const { error: uploadError } = await supabase.storage
                    .from('images')
                    .upload(filePath, buffer, {
                        contentType: file.type || 'image/jpeg'
                    });

                if (!uploadError) {
                    const { data: { publicUrl } } = supabase.storage
                        .from('images')
                        .getPublicUrl(filePath);
                    return NextResponse.json({ url: publicUrl });
                }
                console.error("Erro upload Supabase, tentando local...");
            } catch (e) {
                console.error("Erro conexão Supabase:", e);
            }
        }

        // 2. Fallback para Upload Local (Computador)
        const uploadDir = path.join(process.cwd(), 'public', 'uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        const filePathLocal = path.join(uploadDir, fileName);
        fs.writeFileSync(filePathLocal, buffer);

        const fileUrl = `/uploads/${fileName}`;
        return NextResponse.json({ url: fileUrl });

    } catch (error: any) {
        console.error("Erro geral no upload:", error);
        return NextResponse.json({ error: 'Erro ao processar arquivo' }, { status: 500 });
    }
}
