'use client';

import React, { useState } from 'react';
import { ArrowRightIcon, ExternalLinkIcon, PlusIcon, Trash2Icon, UserIcon } from 'lucide-react';
import type { TeamMember } from '../../../content/types';
import { patcher, slugify, useAdmin } from '../AdminStore';
import { Area, Btn, Card, Grid, ImageField, ListEditor, NumberInput, PageTitle, Select, StatusBadge, Tags, Text } from '../fields';

const blank = (order: number): TeamMember => ({
  id: `member-${Date.now().toString(36)}`,
  name: '', nameFa: '', role: '', roleFa: '', photo: '', bio: '', bioFa: '',
  expertise: [], experience: [], education: '', resume: '', linkedin: '', email: '',
  status: 'draft', order,
});

export function TeamEditor() {
  const { draft, set } = useAdmin();
  const items = draft.team ?? [];
  const [editing, setEditing] = useState<number | null>(null);

  const add = () => {
    set('team', [...items, blank(Math.max(0, ...items.map((m) => m.order)) + 1)]);
    setEditing(items.length);
  };

  if (editing !== null && items[editing]) {
    const m = items[editing];
    const onChange = (v: TeamMember) => set('team', items.map((x, j) => (j === editing ? v : x)));
    const p = patcher(m, onChange);
    return (
      <div className="grid gap-6">
        <div className="flex flex-wrap items-center gap-2">
          <Btn onClick={() => setEditing(null)}><ArrowRightIcon className="h-4 w-4 ltr:rotate-180" />همه اعضا</Btn>
          <div className="flex-1" />
          {m.status !== 'draft' && <a href={`/fa/company#${m.id}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-md border border-line px-3 py-2 text-[13px] text-ink-muted hover:text-ink"><ExternalLinkIcon className="h-4 w-4" />مشاهده</a>}
          <Btn kind="danger" onClick={() => { if (confirm('حذف شود؟')) { set('team', items.filter((_, j) => j !== editing)); setEditing(null); } }}><Trash2Icon className="h-4 w-4" />حذف</Btn>
        </div>
        <PageTitle title={m.nameFa || m.name || 'عضو جدید'} lead="هر فیلد فارسی در نسخه فارسی سایت و هر فیلد انگلیسی در بقیه زبان‌ها نشان داده می‌شود؛ اگر یکی خالی باشد، دیگری جایش می‌آید." />
        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <Card title="عکس و رزومه">
            <ImageField label="عکس پرسنلی" value={m.photo} onChange={p('photo')} folder="team" aspect="aspect-[4/5]"
              hint="عمودی (۴ به ۵)، دست‌کم ۸۰۰ پیکسل ارتفاع، پس‌زمینه ساده. خالی = حروف اول نام." />
            <ImageField label="فایل رزومه (PDF)" value={m.resume} onChange={p('resume')} folder="team" aspect="aspect-[3/1]" accept="any" />
          </Card>
          <Card title="اطلاعات">
            <Grid>
              <Text label="نام و نام خانوادگی (فارسی)" value={m.nameFa} onChange={p('nameFa')} />
              <Text label="Name (English)" value={m.name} onChange={p('name')} ltr />
              <Text label="سمت (فارسی)" value={m.roleFa} onChange={p('roleFa')} placeholder="مثلاً: مدیر فنی" />
              <Text label="Role (English)" value={m.role} onChange={p('role')} ltr placeholder="e.g. CTO" />
            </Grid>
            <Area label="درباره (فارسی)" value={m.bioFa} onChange={p('bioFa')} rows={4} max={600} />
            <Area label="Bio (English)" value={m.bio} onChange={p('bio')} rows={4} ltr max={600} />
            <Tags label="تخصص‌ها" value={m.expertise} onChange={p('expertise')} hint="مثلاً: EPLAN، هوش مصنوعی، طراحی تابلو برق" />
            <ListEditor label="سوابق کاری" items={m.experience} onChange={p('experience')} make={() => ({ period: '', title: '', org: '' })}
              itemTitle={(x) => x.title || 'سابقه'}
              render={(x, setX) => (
                <Grid cols={3}>
                  <Text label="عنوان شغلی" value={x.title} onChange={(title) => setX({ ...x, title })} />
                  <Text label="شرکت / سازمان" value={x.org} onChange={(org) => setX({ ...x, org })} />
                  <Text label="بازه زمانی" value={x.period} onChange={(period) => setX({ ...x, period })} placeholder="۱۳۹۸ تا اکنون" />
                </Grid>
              )} />
            <Area label="تحصیلات" value={m.education} onChange={p('education')} rows={2} />
            <Grid>
              <Text label="LinkedIn" value={m.linkedin} onChange={p('linkedin')} ltr placeholder="https://www.linkedin.com/in/…" />
              <Text label="ایمیل (اختیاری)" value={m.email} onChange={p('email')} ltr type="email" />
            </Grid>
            <Grid cols={3}>
              <Text label="شناسه (برای لینک مستقیم)" value={m.id} onChange={(v) => p('id')(slugify(v) || m.id)} ltr hint={`/company#${m.id}`} />
              <NumberInput label="ترتیب" value={m.order} onChange={p('order')} />
              <Select label="وضعیت" value={m.status} onChange={p('status')} options={[{ value: 'published', label: 'منتشر شده' }, { value: 'draft', label: 'پیش‌نویس' }]} />
            </Grid>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageTitle title="تیم و رزومه‌ها" lead="اعضای تیم در صفحه «درباره ما» با عکس و رزومه نمایش داده می‌شوند. فقط اعضای «منتشر شده» روی سایت می‌آیند." actions={<Btn kind="primary" onClick={add}><PlusIcon className="h-4 w-4" />عضو جدید</Btn>} />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((m, i) => ({ m, i })).sort((a, b) => a.m.order - b.m.order).map(({ m, i }) => (
          <button key={m.id + i} type="button" onClick={() => setEditing(i)} className="flex items-center gap-4 rounded-xl border border-line bg-space-1/80 p-3 text-start hover:bg-space-2">
            <span className="grid h-16 w-14 shrink-0 place-items-center overflow-hidden rounded-lg bg-space-2">
              {m.photo ? <img src={m.photo} alt="" className="h-full w-full object-cover" /> : <UserIcon className="h-6 w-6 text-ink-faint" />}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[14px] text-ink">{m.nameFa || m.name || '—'}</span>
              <span className="mt-1 block truncate text-[12px] text-ink-faint">{m.roleFa || m.role || 'بدون سمت'}</span>
            </span>
            <StatusBadge status={m.status} />
          </button>
        ))}
      </div>
    </div>
  );
}
