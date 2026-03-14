import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { AppHeaderComponent } from '../../shared/components/app-header/app-header.component';
import { ProjectTimelineComponent } from '../../shared/components/project-timeline/project-timeline.component';
import { APP_ICONS } from '../../shared/icons/app-icons';
import { AppRole, NotificationItem, TimelineStep } from '../../shared/models/ui.models';

type Tab = 'pending' | 'accepted';
type LecturerCardTone = 'blue' | 'purple' | 'slate';
type RequestDecision = 'none' | 'approved' | 'rejected';

interface RegistrationItem {
  initials: string;
  lecturer: string;
  tag: string;
  specialty: string;
  quotaLabel: string;
  quotaValue: string;
  progress: number;
  progressClass: string;
  tone: LecturerCardTone;
  full: boolean;
  registered: boolean;
}

interface GroupItem {
  name: string;
  studentId: string;
  specialization: string;
  initials: string;
  tone: LecturerCardTone;
  decision: RequestDecision;
}

@Component({
  selector: 'app-gd2',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, AppHeaderComponent, ProjectTimelineComponent],
  templateUrl: './gd2.component.html',
})
export class Gd2Component {
  role: AppRole = 'student';
  userName = 'Nguyễn Văn A';
  userBadge = 'SV';
  showNotifications = false;
  notifications: NotificationItem[] = [];
  activeTab: Tab = 'pending';
  searchTerm = '';
  readonly icons = APP_ICONS;
  readonly timeline: TimelineStep[] = [
    {
      step: '1',
      title: 'Giai đoạn 1',
      subtitle: 'Chọn hướng chuyên ngành',
      badge: 'Hoàn thành',
      badgeClass: 'bg-green-50 text-green-700 border border-green-100',
      textClass: 'text-slate-700',
      subtitleClass: 'text-slate-500 mb-1',
      active: false,
      completed: true,
    },
    {
      step: '2',
      title: 'Giai đoạn 2',
      subtitle: 'Đăng ký GVHD',
      badge: 'Đang diễn ra',
      badgeClass: 'bg-blue-50 text-blue-700 border border-blue-100',
      textClass: 'text-blue-700',
      subtitleClass: 'text-slate-500 mb-1',
      stepNumberClass: 'text-slate-500',
      active: true,
      time: 'Thời gian đăng ký 20/02 - 25/02',
    },
    {
      step: '3',
      title: 'Giai đoạn 3',
      subtitle: 'Thực hiện Đồ án',
      textClass: 'text-slate-500',
      subtitleClass: 'text-slate-400 mb-2',
      active: false,
      children: [
        { title: 'Phân công chính thức' },
        { title: 'Báo cáo tiến độ 1', muted: true },
        { title: 'Báo cáo tiến độ 2', muted: true },
        { title: 'Nộp đồ án', muted: true },
        { title: 'Bảo vệ Hội đồng', emphasis: true, outlined: true },
      ],
    },
  ];
  studentRegistrations: RegistrationItem[] = [
    {
      initials: 'NV',
      lecturer: 'TS. Nguyễn Văn A',
      tag: 'CNPM',
      specialty: 'Công nghệ phần mềm',
      quotaLabel: 'Đã đăng ký',
      quotaValue: '5/20',
      progress: 25,
      progressClass: 'bg-blue-500',
      tone: 'blue',
      full: false,
      registered: false,
    },
    {
      initials: 'LV',
      lecturer: 'TS. Lê Văn C',
      tag: 'Mạng',
      specialty: 'Mạng máy tính',
      quotaLabel: 'Đã đăng ký',
      quotaValue: '12/20',
      progress: 60,
      progressClass: 'bg-yellow-400',
      tone: 'purple',
      full: false,
      registered: false,
    },
    {
      initials: 'TT',
      lecturer: 'ThS. Trần Thị B',
      tag: 'AI',
      specialty: 'Trí tuệ nhân tạo',
      quotaLabel: 'Đã đăng ký',
      quotaValue: '15/15',
      progress: 100,
      progressClass: 'bg-red-500',
      tone: 'slate',
      full: true,
      registered: false,
    },
  ];
  pendingGroups: GroupItem[] = [
    {
      name: 'Lê Hoàng Nam',
      studentId: '2011001',
      specialization: 'Công nghệ phần mềm',
      initials: 'LHN',
      tone: 'blue',
      decision: 'none',
    },
    {
      name: 'Nguyễn Thúy Vy',
      studentId: '2011002',
      specialization: 'Trí tuệ nhân tạo',
      initials: 'NTV',
      tone: 'purple',
      decision: 'none',
    },
  ];
  acceptedGroups: GroupItem[] = [];

  switchRole(role: AppRole): void {
    this.role = role;
    this.userName = role === 'lecturer' ? 'TS. Giảng Viên A' : 'Nguyễn Văn A';
    this.userBadge = role === 'lecturer' ? 'GV' : 'SV';
  }

  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
  }

  clearNotifications(): void {
    this.notifications = [];
    this.showNotifications = false;
  }

  get pageTitle(): string {
    return this.role === 'student' ? 'Đăng ký Giảng viên Hướng dẫn' : 'Duyệt sinh viên đăng ký';
  }

  get filteredRegistrations(): RegistrationItem[] {
    const keyword = this.searchTerm.trim().toLowerCase();
    if (!keyword) {
      return this.studentRegistrations;
    }

    return this.studentRegistrations.filter((item) =>
      [item.lecturer, item.tag, item.specialty].some((value) => value.toLowerCase().includes(keyword))
    );
  }

  get pendingCount(): number {
    return this.pendingGroups.filter((group) => group.decision === 'none').length;
  }

  get acceptedCount(): number {
    return this.acceptedGroups.filter((group) => group.decision === 'approved').length;
  }

  toggleRegister(item: RegistrationItem): void {
    if (item.full) {
      return;
    }

    item.registered = !item.registered;
    this.addNotification(
      item.registered
        ? `Đăng ký thành công GVHD <b>${item.lecturer}</b>.`
        : `Đã hủy đăng ký GVHD <b>${item.lecturer}</b>.`
    );
  }

  switchLecturerTab(tab: Tab): void {
    this.activeTab = tab;
  }

  approveAll(): void {
    for (const group of this.pendingGroups.filter((item) => item.decision === 'none')) {
      this.handleLecturerAction(group, 'approve');
    }
  }

  handleLecturerAction(group: GroupItem, action: 'approve' | 'reject'): void {
    if (action === 'approve') {
      group.decision = 'approved';
      this.pendingGroups = this.pendingGroups.filter((item) => item !== group);
      this.acceptedGroups = [...this.acceptedGroups, group];
      this.addNotification(`Bạn đã duyệt yêu cầu của <b>${group.name}</b>.`);
      return;
    }

    group.decision = 'rejected';
    this.addNotification(`Bạn đã từ chối yêu cầu của <b>${group.name}</b>.`);
  }

  cardClass(item: RegistrationItem): string {
    if (item.full) {
      return 'bg-white p-4 rounded-xl border border-slate-200 shadow-sm opacity-70 flex flex-col md:flex-row items-center justify-between gap-4';
    }

    if (item.tone === 'blue') {
      return 'bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300 transition flex flex-col md:flex-row items-center justify-between gap-4 group';
    }

    return 'bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-purple-300 transition flex flex-col md:flex-row items-center justify-between gap-4 group';
  }

  initialsClass(tone: LecturerCardTone): string {
    switch (tone) {
      case 'blue':
        return 'h-12 w-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center font-bold text-lg border border-blue-200';
      case 'purple':
        return 'h-12 w-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center font-bold text-lg border border-purple-100';
      default:
        return 'h-12 w-12 bg-slate-100 text-slate-500 rounded-xl flex items-center justify-center font-bold text-lg border border-slate-200';
    }
  }

  tagClass(tone: LecturerCardTone): string {
    switch (tone) {
      case 'blue':
        return 'bg-blue-50 text-blue-700 border border-blue-100 text-[10px] uppercase font-bold px-1.5 py-0.5 rounded';
      case 'purple':
        return 'bg-purple-50 text-purple-700 border border-purple-100 text-[10px] uppercase font-bold px-1.5 py-0.5 rounded';
      default:
        return 'bg-slate-100 text-slate-600 border border-slate-200 text-[10px] uppercase font-bold px-1.5 py-0.5 rounded';
    }
  }

  quotaValueClass(item: RegistrationItem): string {
    if (item.progress >= 100) {
      return 'text-red-600';
    }
    if (item.progress >= 60) {
      return 'text-yellow-600';
    }
    return 'text-blue-600';
  }

  lecturerRequestCardClass(_group: GroupItem): string {
    return 'bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col md:flex-row items-start md:items-center justify-between gap-4 group';
  }

  decisionBadgeClass(decision: RequestDecision): string {
    return decision === 'approved'
      ? 'px-4 py-2 text-xs font-bold text-green-600 bg-green-50 rounded-lg border border-green-200 w-full text-center'
      : 'px-4 py-2 text-xs font-bold text-red-600 bg-red-50 rounded-lg border border-red-200 w-full text-center';
  }

  decisionLabel(decision: RequestDecision): string {
    return decision === 'approved' ? 'Đã tiếp nhận' : 'Đã từ chối';
  }

  lecturerNameClass(item: RegistrationItem): string {
    if (item.tone === 'blue') {
      return 'group-hover:text-blue-600';
    }
    if (item.tone === 'purple') {
      return 'group-hover:text-purple-600';
    }
    return '';
  }

  private addNotification(message: string): void {
    this.notifications.unshift({ message });
  }
}
