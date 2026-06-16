#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""删除 index.html 中的我的团队弹窗和邀请用户详情弹窗"""

with open('D:/Project/pet-applet/index.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# 找到我的团队弹窗的开始行
start_idx = None
for i in range(len(lines) - 1, -1, -1):
    if '<!-- ==================== 我的团队弹窗 ==================== -->' in lines[i]:
        start_idx = i
        break

if start_idx is not None:
    # 保留 start_idx 之前的内容
    new_lines = lines[:start_idx]
    
    # 确保文件以正确的标签结束
    has_closing = False
    for line in new_lines:
        if '</body>' in line or '</html>' in line:
            has_closing = True
            break
    
    if not has_closing:
        new_lines.append('  </body>\n')
        new_lines.append('</html>\n')
    
    with open('D:/Project/pet-applet/index.html', 'w', encoding='utf-8') as f:
        f.writelines(new_lines)
    
    deleted_count = len(lines) - len(new_lines)
    print(f'成功删除了 {deleted_count} 行（邀请弹窗已移除）')
else:
    print('未找到我的团队弹窗，无需删除')
