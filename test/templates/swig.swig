hey {{global.ho}} let's {% include "go" -%}

{%- for i in global.emptylist %}
    I hope nobody's taping this!
{% endfor -%}

{% for x in global.stringlist %}
{% if loop.first %}<ul>{% endif %}
    <li>{{ loop.index }} - {{ loop.key }}: {{ x }}</li>
{% if loop.last %}</ul>{% endif %}
{% endfor %}
