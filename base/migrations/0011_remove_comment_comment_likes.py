# Generated by Django 4.2.6 on 2023-12-12 07:02

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0010_remove_follower_follower_id_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='comment',
            name='comment_likes',
        ),
    ]